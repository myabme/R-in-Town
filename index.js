/**
 * 👑 PROJECT: RAIN TOWN - THE ULTIMATE WORLD
 * 👨‍💻 DEVELOPER: LORD WILKED (V-INFINITY)
 * 🛡️ SYSTEMS: ALL-IN-ONE (BANK, SHOP, ID, TICKETS, ADMIN, PROTECTION)
 * ⚪ STYLE: WHITE BUTTONS | BLACK EMBEDS | 4K GTA VISUALS
 */

const { 
    Client, GatewayIntentBits, ActivityType, EmbedBuilder, ActionRowBuilder, 
    ButtonBuilder, ButtonStyle, PermissionsBitField, ModalBuilder, 
    TextInputBuilder, TextInputStyle, InteractionType, StringSelectMenuBuilder, ChannelType 
} = require('discord.js');
const fs = require('fs');

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const bot = new Client({ intents: [3276799] });

const BLACK = 0x000000;
const FOOTER = "Rain Town Global Control | Developed by LORD WILKED";
const DB_FILE = './rain_town_final_db.json';

// --- [ قاعدة البيانات ] ---
let db = { 
    players: {}, 
    names: [], 
    config: { citizenRole: null }, // لتخزين رتبة المواطن
    shop: [
        { id: '1', name: 'رتبة VIP', price: 50000, emoji: '💎' },
        { id: '2', name: 'سلاح كلاش', price: 15000, emoji: '🔫' }
    ] 
};
if (fs.existsSync(DB_FILE)) {
    try { db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } catch (e) { console.error("DB Error."); }
}
const save = () => fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 4));

const FAMOUS_NAMES = ["كافح", "ماثيو", "Kafh", "Matthew", "ابو فله", "بندريتا", "ويلكد", "الورد"];

// --- [ معرض صور قراند الاحترافي ] ---
const IMG = {
    MAIN: "https://i.pinimg.com/originals/9e/42/06/9e420658421469038e68f3e5832a76f2.gif",
    BANK: "https://i.imgur.com/vH9v50R.jpg",    // صورة بنك Maze Bank
    TICKET: "https://i.imgur.com/GscX8sA.jpg",  // صورة دعم فني قراند
    SHOP: "https://i.imgur.com/N7W0zM4.jpg",    // صورة محل ملابس/أسلحة
    ID: "https://i.imgur.com/v9qI9mU.jpg",      // صورة مركز شرطة قراند
    ADMIN: "https://i.imgur.com/S6eXjZJ.jpg"    // صورة سيارات شرطة ومهمات
};

bot.on('ready', () => {
    console.log(`🔥 [RAIN TOWN SUPREME] - LORD WILKED IS IN CONTROL.`);
    bot.user.setActivity('Rain Town | !help', { type: ActivityType.Watching });
});

bot.on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return;

    // 🛡️ درع الحماية
    const shield = /رب|دين|الله|امك|ابوك|اهلك|عرض|شرف|قحبه|منيوك|زق|حمار|ثور/g;
    if (shield.test(message.content.toLowerCase()) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        await message.delete().catch(() => {});
        return message.channel.send(`**⚠️ [أمن الدولة]: الزم حدودك يا {${message.author.username}}..**`).then(m => setTimeout(() => m.delete(), 3000));
    }

    if (!message.content.startsWith('!')) return;
    const args = message.content.slice(1).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();

    // 📜 نظام HELP
    if (cmd === 'help' || cmd === 'اوامر') {
        const h = new EmbedBuilder()
            .setTitle("👑 دستور Rain Town | سيطرة LORD WILKED")
            .setDescription("**الأوامر الإدارية والمدنية:**")
            .setImage(IMG.MAIN).setColor(BLACK).setFooter({ text: FOOTER })
            .addFields(
                { name: '🛡️ الإدارة', value: '`!مسح [عدد]` `!ban` `!kick` `!تفعيل` `!رتب`' },
                { name: '🏦 الاقتصاد', value: '`!بنك` `!تحويل` `!راتب` `!منح`' },
                { name: '🛒 التجارة', value: '`!متجر` `!حقيبة` `!تعديل_متجر`' }
            );
        return message.channel.send({ embeds: [h] });
    }

    // 🧹 أمر المسح (Clear)
    if (cmd === 'مسح' || cmd === 'clear') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return;
        const amount = parseInt(args[0]) || 100;
        await message.channel.bulkDelete(amount > 100 ? 100 : amount, true);
        message.channel.send(`✅ تم تنظيف القارة من **${amount}** رسالة.`).then(m => setTimeout(() => m.delete(), 3000));
    }

    // 🏷️ أمر تحديد رتبة المواطن (رتب)
    if (cmd === 'رتب' || cmd === 'رتبة') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
        const role = message.mentions.roles.first();
        if (!role) return message.reply("منشن الرتبة اللي تبي تخليها للمواطنين!");
        db.config.citizenRole = role.id; save();
        return message.reply(`✅ تم اعتماد رتبة **${role.name}** كصلاحية رسمية للمواطنين.`);
    }

    // ⚙️ نظام الـ SETUP
    if (cmd === 'setup' && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        const sEmbed = new EmbedBuilder().setTitle("⚙️ لوحة تحكم Rain Town").setDescription("ارسل الأنظمة بصورها المخصصة:").setColor(BLACK).setImage(IMG.ADMIN);
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('set_id').setLabel('نظام الهوية').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('set_bank').setLabel('نظام البنك').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('set_shop').setLabel('نظام المتجر').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('set_ticket').setLabel('نظام التذاكر').setStyle(ButtonStyle.Secondary)
        );
        return message.channel.send({ embeds: [sEmbed], components: [row] });
    }
});

// --- [ محرك التفاعلات - الأزرار والمودالات ] ---
bot.on('interactionCreate', async i => {
    try {
        // --- إرسال الأنظمة (Setup) ---
        if (i.customId === 'set_id') {
            const embed = new EmbedBuilder().setTitle("🇸🇦 إصدار هوية Rain Town").setDescription("سجل الآن لدخول القارة.").setImage(IMG.ID).setColor(BLACK);
            const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('open_id').setLabel('إصدار هوية').setStyle(ButtonStyle.Secondary));
            return i.channel.send({ embeds: [embed], components: [row] });
        }
        if (i.customId === 'set_bank') {
            const embed = new EmbedBuilder().setTitle("🏦 بنك Maze Bank المركزي").setDescription("أدر أموالك في Rain Town.").setImage(IMG.BANK).setColor(BLACK);
            const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('bal').setLabel('إظهار الرصيد').setStyle(ButtonStyle.Secondary));
            return i.channel.send({ embeds: [embed], components: [row] });
        }
        if (i.customId === 'set_ticket') {
            const embed = new EmbedBuilder().setTitle("📩 الدعم الفني لـ Rain Town").setDescription("افتح تذكرة للتواصل مع الإدارة.").setImage(IMG.TICKET).setColor(BLACK);
            const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('open_ticket').setLabel('فتح تذكرة').setStyle(ButtonStyle.Secondary));
            return i.channel.send({ embeds: [embed], components: [row] });
        }
        if (i.customId === 'set_shop') {
            const embed = new EmbedBuilder().setTitle("🛒 متجر Rain Town العام").setDescription("تسوق أفضل الأغراض والرتب.").setImage(IMG.SHOP).setColor(BLACK);
            const options = db.shop.map(s => ({ label: s.name, description: `${s.price} ريال`, value: s.id, emoji: s.emoji }));
            const menu = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setCustomId('buy').setPlaceholder('اختر غرضاً..').addOptions(options));
            return i.channel.send({ embeds: [embed], components: [menu] });
        }

        // --- نظام التذاكر (مُصلح) ---
        if (i.customId === 'open_ticket') {
            const channel = await i.guild.channels.create({
                name: `ticket-${i.user.username}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    { id: i.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                    { id: i.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
                ]
            });
            const tEmbed = new EmbedBuilder().setTitle("📩 تذكرة جديدة").setDescription(`أهلاً بك يا ${i.user}، انتظر رد الإدارة.`).setColor(BLACK);
            const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('close_ticket').setLabel('إغلاق التذكرة').setStyle(ButtonStyle.Danger));
            await channel.send({ embeds: [tEmbed], components: [row] });
            return i.reply({ content: `✅ تم فتح تذكرتك هنا: ${channel}`, ephemeral: true });
        }
        if (i.customId === 'close_ticket') {
            await i.reply("سيتم إغلاق التذكرة بعد 3 ثوانٍ...");
            setTimeout(() => i.channel.delete(), 3000);
        }

        // --- نظام الهوية (مُصلح مع الرتبة التلقائية) ---
        if (i.customId === 'open_id') {
            const modal = new ModalBuilder().setCustomId('id_modal').setTitle('هوية Rain Town');
            modal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('n').setLabel("الاسم الثلاثي").setStyle(TextInputStyle.Short)));
            await i.showModal(modal);
        }
        if (i.type === InteractionType.ModalSubmit && i.customId === 'id_modal') {
            const name = i.fields.getTextInputValue('n');
            if (db.names.includes(name)) return i.reply({ content: "❌ الاسم مكرر!", ephemeral: true });
            db.players[i.user.id] = { name, balance: 5000, inv: [] };
            db.names.push(name); save();
            if (db.config.citizenRole) await i.member.roles.add(db.config.citizenRole).catch(() => {});
            await i.reply({ content: `✅ مبروك يا **${name}**! استلمت الهوية و 5,000 ريال.`, ephemeral: true });
        }

        // --- البنك والمتجر ---
        if (i.customId === 'bal') {
            const p = db.players[i.user.id];
            return i.reply({ content: `💰 رصيدك الحالي: **${p ? p.balance : 0}** ريال.`, ephemeral: true });
        }
        if (i.isStringSelectMenu() && i.customId === 'buy') {
            const item = db.shop.find(s => s.id === i.values[0]);
            const p = db.players[i.user.id];
            if (!p || p.balance < item.price) return i.reply({ content: "❌ رصيدك غير كافٍ!", ephemeral: true });
            p.balance -= item.price; p.inv.push(`${item.emoji} ${item.name}`); save();
            return i.reply({ content: `✅ اشتريت **${item.name}** بنجاح!`, ephemeral: true });
        }

    } catch (error) { console.error(error); }
});

bot.login(DISCORD_TOKEN);
