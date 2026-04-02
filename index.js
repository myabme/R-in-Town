/**
 * 👑 PROJECT: RAIN TOWN - THE ULTIMATE WORLD
 * 👨‍💻 DEVELOPER: LORD WILKED (V-INFINITY)
 * 🛡️ SYSTEMS: ALL-IN-ONE (BANK, SHOP, ID, TICKETS, ADMIN, PROTECTION)
 * ⚪ STYLE: WHITE BUTTONS | BLACK EMBEDS | 4K GTA VISUALS
 */

const { 
    Client, GatewayIntentBits, ActivityType, EmbedBuilder, ActionRowBuilder, 
    ButtonBuilder, ButtonStyle, PermissionsBitField, ModalBuilder, 
    TextInputBuilder, TextInputStyle, InteractionType, StringSelectMenuBuilder 
} = require('discord.js');
const fs = require('fs');

const bot = new Client({ intents: [3276799] });

const BLACK = 0x000000;
const FOOTER = "Rain Town Global Control | Developed by LORD WILKED";
const DB_FILE = './rain_town_final_db.json';

// --- [ قاعدة البيانات ] ---
let db = { 
    players: {}, 
    names: [], 
    shop: [
        { id: '1', name: 'رتبة VIP', price: 50000, emoji: '💎' },
        { id: '2', name: 'سلاح كلاش', price: 15000, emoji: '🔫' }
    ] 
};
if (fs.existsSync(DB_FILE)) db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
const save = () => fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 4));

// --- [ حماية الأسماء ] ---
const FAMOUS_NAMES = ["كافح", "ماثيو", "Kafh", "Matthew", "ابو فله", "بندريتا", "ويلكد", "الورد"];

// --- [ صور قراند 4K مخصصة ] ---
const IMG = {
    MAIN: "https://i.pinimg.com/originals/9e/42/06/9e420658421469038e68f3e5832a76f2.gif",
    BANK: "https://i.ytimg.com/vi/u1q5e_mS690/maxresdefault.jpg",
    TICKET: "https://i.ytimg.com/vi/3R-U5_B48-Q/maxresdefault.jpg",
    SHOP: "https://w0.peakpx.com/wallpaper/612/820/wallpaper-gta-v-city.jpg",
    ID: "https://r2.erpics.com/gta5/mod/202105/25/1621944547_957.jpg"
};

bot.on('ready', () => {
    console.log(`🔥 [RAIN TOWN SUPREME] - LORD WILKED IS IN CONTROL.`);
    bot.user.setActivity('Rain Town | !help', { type: ActivityType.Watching });
});

bot.on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return;

    // 🛡️ [ درع الحماية - منع السب والروابط ]
    const shield = /رب|دين|الله|امك|ابوك|اهلك|عرض|شرف|قحبه|منيوك|زق|حمار|ثور/g;
    if (shield.test(message.content.toLowerCase()) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        await message.delete().catch(() => {});
        return message.channel.send(`**⚠️ [أمن الدولة]: الزم حدودك يا {${message.author.username}}.. هنا دولة LORD WILKED.**`).then(m => setTimeout(() => m.delete(), 3000));
    }

    if (!message.content.startsWith('!')) return;
    const args = message.content.slice(1).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();

    // 📜 [ نظام HELP ]
    if (cmd === 'help' || cmd === 'اوامر') {
        const h = new EmbedBuilder()
            .setTitle("👑 دستور Rain Town | سيطرة LORD WILKED")
            .setDescription("**جميع الأنظمة المتاحة في القارة (أبيض وأسود):**")
            .setImage(IMG.MAIN).setColor(BLACK).setFooter({ text: FOOTER })
            .addFields(
                { name: '🛡️ الإدارة', value: '`!ban` `!kick` `!mute` `!clear` `!تفعيل` `!رتبة` `!لون` `!اسم`' },
                { name: '🏦 الاقتصاد', value: '`!بنك` `!تحويل` `!راتب` `!منح` `!سحب_فلوس`' },
                { name: '🛒 التجارة', value: '`!متجر` `!حقيبة` `!تعديل_متجر`' },
                { name: '⚙️ الإعدادات', value: '`!setup` `!say` `!embed` `!restart`' }
            );
        return message.channel.send({ embeds: [h] });
    }

    // 🛒 [ تعديل المتجر ]
    if (cmd === 'تعديل_متجر' && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        if (args.length >= 3) {
            db.shop.push({ id: Date.now().toString(), name: args[0], price: parseInt(args[1]), emoji: args[2] });
            save(); return message.reply(`✅ تم إضافة **${args[0]}** للمتجر بنجاح.`);
        }
        return message.reply("!تعديل_متجر [اسم] [سعر] [ايموجي]");
    }

    // 🎒 [ الحقيبة ]
    if (cmd === 'حقيبة' || cmd === 'شنطة') {
        const p = db.players[message.author.id];
        if (!p) return message.reply("سجل هويتك أولاً!");
        const items = p.inv?.length > 0 ? p.inv.join('\n') : "الحقيبة فارغة.";
        const bagEmbed = new EmbedBuilder().setTitle(`🎒 حقيبة: ${p.name}`).setDescription(`**محتوياتك في Rain Town:**\n${items}`).setColor(BLACK).setImage(IMG.SHOP);
        return message.channel.send({ embeds: [bagEmbed] });
    }

    // ⚙️ [ نظام الـ SETUP ]
    if (cmd === 'setup' && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        const sEmbed = new EmbedBuilder().setTitle("⚙️ لوحة تحكم Rain Town").setDescription("ارسل الأنظمة بصورها المخصصة (أزرار بيضاء):").setColor(BLACK);
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('set_id').setLabel('إرسال الهوية').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('set_bank').setLabel('إرسال البنك').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('set_shop').setLabel('إرسال المتجر').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('set_ticket').setLabel('إرسال التذاكر').setStyle(ButtonStyle.Secondary)
        );
        return message.channel.send({ embeds: [sEmbed], components: [row] });
    }
});

// --- [ محرك التفاعلات ] ---
bot.on('interactionCreate', async i => {
    if (!db.players[i.user.id] && !i.customId.startsWith('set_') && i.customId !== 'open_id') {
        return i.reply({ content: "❌ سجل هويتك أولاً!", ephemeral: true });
    }

    // إرسال الأنظمة
    if (i.customId === 'set_id') {
        const embed = new EmbedBuilder().setTitle("🇸🇦 إصدار هوية Rain Town").setDescription("سجل بياناتك لدخول القارة واحصل على 5,000 ريال مكافأة.").setImage(IMG.ID).setColor(BLACK);
        const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('open_id').setLabel('إصدار هوية').setStyle(ButtonStyle.Secondary));
        return i.channel.send({ embeds: [embed], components: [row] });
    }

    if (i.customId === 'set_bank') {
        const embed = new EmbedBuilder().setTitle("🏦 بنك Rain Town المركزي").setDescription("تحكم في أموالك، تحويلاتك، ورصيدك.").setImage(IMG.BANK).setColor(BLACK);
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('bal').setLabel('إظهار الرصيد').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('dep').setLabel('إيداع').setStyle(ButtonStyle.Secondary)
        );
        return i.channel.send({ embeds: [embed], components: [row] });
    }

    if (i.customId === 'set_shop') {
        const embed = new EmbedBuilder().setTitle("🛒 متجر Rain Town").setDescription("اشترِ الأغراض والرتب.").setImage(IMG.SHOP).setColor(BLACK);
        const options = db.shop.map(s => ({ label: s.name, description: `${s.price} ريال`, value: s.id, emoji: s.emoji }));
        const menu = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setCustomId('buy').setPlaceholder('اختر غرضاً لشرائه').addOptions(options));
        return i.channel.send({ embeds: [embed], components: [menu] });
    }

    // معالجة الهوية
    if (i.customId === 'open_id') {
        const modal = new ModalBuilder().setCustomId('id_modal').setTitle('هوية Rain Town');
        modal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('n').setLabel("الاسم (يمنع التكرار)").setStyle(TextInputStyle.Short)));
        await i.showModal(modal);
    }

    if (i.type === InteractionType.ModalSubmit && i.customId === 'id_modal') {
        const name = i.fields.getTextInputValue('n');
        if (db.names.includes(name) || FAMOUS_NAMES.some(fn => name.includes(fn))) return i.reply({ content: "❌ الاسم مكرر أو انتحال شخصية!", ephemeral: true });
        db.players[i.user.id] = { name, balance: 5000, inv: [] };
        db.names.push(name); save();
        await i.reply({ content: `✅ أهلاً بك يا **${name}**! تم منحك 5,000 ريال مكافأة.`, ephemeral: true });
    }

    // شراء من المتجر
    if (i.isStringSelectMenu() && i.customId === 'buy') {
        const item = db.shop.find(s => s.id === i.values[0]);
        const p = db.players[i.user.id];
        if (p.balance < item.price) return i.reply({ content: "❌ رصيدك لا يكفي!", ephemeral: true });
        p.balance -= item.price; p.inv.push(`${item.emoji} ${item.name}`); save();
        return i.reply({ content: `✅ مبروك! اشتريت **${item.name}** من متجر Rain Town.`, ephemeral: true });
    }

    if (i.customId === 'bal') {
        return i.reply({ content: `💰 رصيدك في Rain Town: **${db.players[i.user.id].balance}** ريال.`, ephemeral: true });
    }
});

bot.login(DISCORD_TOKEN);
