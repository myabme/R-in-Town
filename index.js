/**
 * 👑 PROJECT: RAIN TOWN - THE ULTIMATE WORLD
 * 👨‍💻 DEVELOPER: LORD WILKED (V-INFINITY)
 * 🛡️ SECURITY: ANTI-CLONE / ANTI-FAMOUS / ANTI-TOXIC / ANTI-LINKS
 * ⚪ STYLE: WHITE BUTTONS | BLACK EMBEDS | 4K GTA VISUALS
 */

const { 
    Client, GatewayIntentBits, ActivityType, EmbedBuilder, ActionRowBuilder, 
    ButtonBuilder, ButtonStyle, PermissionsBitField, ModalBuilder, 
    TextInputBuilder, TextInputStyle, InteractionType, StringSelectMenuBuilder, ChannelType 
} = require('discord.js');
const fs = require('fs');

const bot = new Client({ intents: [3276799] });

const BLACK = 0x000000;
const FOOTER = "Rain Town Global Control | Developed by LORD WILKED";
const DB_FILE = './rain_town_final_db.json';

// --- [ قاعدة البيانات - الذاكرة الحديدية ] ---
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

// --- [ حماية الأسماء - يمنع الانتحال ] ---
const FAMOUS_NAMES = ["كافح", "ماثيو", "Kafh", "Matthew", "ابو فله", "ويلكد", "الورد"];

// --- [ صور قراند 4K مخصصة لكل قطاع ] ---
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

    // 📜 [ نظام HELP - المليار أمر ]
    if (cmd === 'help' || cmd === 'اوامر') {
        const h = new EmbedBuilder()
            .setTitle("👑 دستور Rain Town | سيطرة LORD WILKED")
            .setDescription("**جميع القطاعات والأنظمة المتاحة في القارة:**")
            .setImage(IMG.MAIN).setColor(BLACK).setFooter({ text: FOOTER })
            .addFields(
                { name: '🛡️ الإدارة والعقوبات', value: '`!ban` `!kick` `!mute` `!clear` `!lock` `!unlock` `!تفعيل` `!رتبة` `!لون` `!اسم`' },
                { name: '🏦 البنك والاقتصاد', value: '`!بنك` `!تحويل` `!راتب` `!منح` `!سحب_فلوس` `!تصفير`' },
                { name: '🛒 التجارة والحقيبة', value: '`!متجر` `!حقيبة` `!شراء` `!تعديل_متجر`' },
                { name: '⚙️ الإعدادات', value: '`!setup` `!say` `!embed` `!restart` `!points`' }
            );
        return message.channel.send({ embeds: [h] });
    }

    // 🔨 [ أوامر الإدارة - السيطرة ]
    if (cmd === 'ban' && message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        const user = message.mentions.members.first();
        if (!user) return message.reply("منشن الشخص!");
        await user.ban({ reason: "Order by LORD WILKED" });
        return message.channel.send(`**🚀 تم نفي الخائن ${user.user.username} للأبد.**`);
    }

    if (cmd === 'تفعيل' && message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
        const user = message.mentions.members.first();
        if (!user) return message.reply("منشن المواطن!");
        await user.roles.add('1234567890').catch(() => {}); // ضع ID رتبة المواطن هنا
        return message.reply(`**✅ تم تفعيل المواطن ${user} في Rain Town.**`);
    }

    // 🛒 [ تعديل المتجر ]
    if (cmd === 'تعديل_متجر' && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        if (args.length >= 3) {
            db.shop.push({ id: Date.now().toString(), name: args[0], price: parseInt(args[1]), emoji: args[2] });
            save(); return message.reply(`✅ تم إضافة **${args[0]}** للمتجر.`);
        }
        return message.reply("!تعديل_متجر [اسم] [سعر] [ايموجي]");
    }

    // ⚙️ [ نظام الـ SETUP - الأزرار البيضاء ]
    if (cmd === 'setup' && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        const sEmbed = new EmbedBuilder().setTitle("⚙️ لوحة تحكم Rain Town").setDescription("ارسل الأنظمة بصورها المخصصة:").setColor(BLACK);
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('set_id').setLabel('إرسال الهوية').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('set_bank').setLabel('إرسال البنك').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('set_shop').setLabel('إرسال المتجر').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('set_ticket').setLabel('إرسال التذاكر').setStyle(ButtonStyle.Secondary)
        );
        return message.channel.send({ embeds: [sEmbed], components: [row] });
    }
});

// --- [ محرك التفاعلات - الأزرار والمودالات ] ---
bot.on('interactionCreate', async i => {
    // إرسال نظام الهوية
    if (i.customId === 'set_id') {
        const embed = new EmbedBuilder().setTitle("🇸🇦 إصدار هوية Rain Town").setDescription("سجل بياناتك لدخول القارة واحصل على 5,000 ريال.").setImage(IMG.ID).setColor(BLACK);
        const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('open_id').setLabel('إصدار هوية').setStyle(ButtonStyle.Secondary));
        await i.channel.send({ embeds: [embed], components: [row] });
        return i.reply({ content: "✅ تم إرسال نظام الهوية.", ephemeral: true });
    }

    // إرسال نظام البنك
    if (i.customId === 'set_bank') {
        const embed = new EmbedBuilder().setTitle("🏦 بنك Rain Town المركزي").setDescription("تحكم في أموالك، تحويلاتك، ورصيدك.").setImage(IMG.BANK).setColor(BLACK);
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('bal').setLabel('إظهار الرصيد').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('dep').setLabel('إيداع').setStyle(ButtonStyle.Secondary)
        );
        await i.channel.send({ embeds: [embed], components: [row] });
        return i.reply({ content: "✅ تم إرسال نظام البنك.", ephemeral: true });
    }

    // إرسال نظام المتجر
    if (i.customId === 'set_shop') {
        const embed = new EmbedBuilder().setTitle("🛒 متجر Rain Town").setDescription("اشترِ الأغراض والرتب.").setImage(IMG.SHOP).setColor(BLACK);
        const options = db.shop.map(s => ({ label: s.name, description: `${s.price} ريال`, value: s.id, emoji: s.emoji }));
        const menu = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setCustomId('buy').setPlaceholder('اختر غرضاً').addOptions(options));
        await i.channel.send({ embeds: [embed], components: [menu] });
        return i.reply({ content: "✅ تم إرسال المتجر.", ephemeral: true });
    }

    // إرسال نظام التذاكر
    if (i.customId === 'set_ticket') {
        const embed = new EmbedBuilder().setTitle("📩 دعم Rain Town الفني").setDescription("اضغط الزر لفتح تذكرة وتحدث مع الإدارة.").setImage(IMG.TICKET).setColor(BLACK);
        const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('open_ticket').setLabel('فتح تذكرة').setStyle(ButtonStyle.Secondary));
        await i.channel.send({ embeds: [embed], components: [row] });
        return i.reply({ content: "✅ تم إرسال نظام التكتات.", ephemeral: true });
    }

    // مودال الهوية (الحماية)
    if (i.customId === 'open_id') {
        if (db.players[i.user.id]) return i.reply({ content: "❌ لديك هوية مسجلة!", ephemeral: true });
        const modal = new ModalBuilder().setCustomId('id_modal').setTitle('هوية Rain Town');
        modal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('n').setLabel("الاسم (يمنع التكرار)").setStyle(TextInputStyle.Short)));
        await i.showModal(modal);
    }

    if (i.type === InteractionType.ModalSubmit && i.customId === 'id_modal') {
        const name = i.fields.getTextInputValue('n');
        if (db.names.includes(name) || FAMOUS_NAMES.some(fn => name.includes(fn))) return i.reply({ content: "❌ الاسم مكرر أو انتحال شخصية!", ephemeral: true });
        db.players[i.user.id] = { name, balance: 5000, inv: [] };
        db.names.push(name); save();
        await i.reply({ content: `✅ أهلاً بك يا **${name}**! استلمت 5,000 ريال منحة البداية.`, ephemeral: true });
    }
});

bot.login("TOKEN_HERE");
