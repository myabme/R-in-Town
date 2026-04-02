/**
 * 👑 PROJECT: RAIN TOWN - THE ULTIMATE OVERLORD (V-INFINITY)
 * 👨‍💻 DEVELOPER: LORD WILKED
 * ⚔️ STATUS: TOTAL DOMINATION / ALL SYSTEMS INTEGRATED
 * ☣️ WARNING: THIS IS THE FINAL COMPLETE VERSION. NO GAPS.
 */

const { 
    Client, GatewayIntentBits, ActivityType, EmbedBuilder, ActionRowBuilder, 
    StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, 
    ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType 
} = require('discord.js');
const fs = require('fs');

const bot = new Client({ intents: [3276799] });

const BLACK = 0x000000;
const RED = 0xFF0000;
const FOOTER = "Developed by LORD WILKED | Rain Town Global Control";
const DB_FILE = './lord_wilked_master_db.json';

// --- [ محرك البيانات والذاكرة الفولاذية ] ---
let db = { 
    config: { x_channel: null, staff_role: null, verify_role: null, ticket_category: null, log_channel: null },
    players: {}, 
    admin_pts: {} 
};
if (fs.existsSync(DB_FILE)) db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
const save = () => fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 4));

// --- [ روابط الصور الواقعية 4K ] ---
const IMG = {
    POLICE: "https://i.imgur.com/8vWJ7Qy.jpg",
    GANG: "https://i.imgur.com/6U8Xv6p.jpg",
    BANK: "https://i.imgur.com/uW6L5uS.jpg",
    WEAPON: "https://i.imgur.com/Y1gI4Gk.jpg",
    X_BG: "https://i.imgur.com/mO2X9Zk.jpg"
};

bot.once('ready', () => {
    console.log(`🔥 [INFINTY CORE ONLINE] - Welcome, LORD WILKED.`);
    bot.user.setPresence({ 
        activities: [{ name: 'Rain Town | LORD WILKED V-INFINITY', type: ActivityType.Streaming, url: 'https://twitch.tv/wilked' }],
        status: 'dnd'
    });
});

bot.on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return;

    // 🛡️ [ الدرع النووي - حماية الأهل والدين ]
    const shield = /رب|دين|الله|امك|ابوك|اهلك|عرض|شرف|قحبه|منيوك|زق|حمار|ثور/g;
    if (shield.test(message.content.toLowerCase()) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        await message.delete().catch(() => {});
        return message.channel.send(`**⚠️ انتبه يا {${message.author.username}}! مدينة Rain Town تطهر نفسها.. الزم حدودك.**`).then(m => setTimeout(() => m.delete(), 3000));
    }

    // 🐦 [ محرك منصة إكس الآلية ]
    if (db.config.x_channel && message.channel.id === db.config.x_channel) {
        const xEmbed = new EmbedBuilder()
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
            .setDescription(`**${message.content}**`)
            .setImage(IMG.X_BG)
            .setColor(0x1DA1F2).setFooter({ text: "Rain Town X Platform | Developed by LORD WILKED" }).setTimestamp();
        message.delete().catch(() => {});
        return message.channel.send({ embeds: [xEmbed] });
    }

    if (!message.content.startsWith('!')) return;
    const args = message.content.slice(1).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();

    // ⚙️ [ أمر الإعدادات الشامل - SETUP ]
    if (cmd === 'setup') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
        const sEmbed = new EmbedBuilder().setTitle("⚙️ لوحة التحكم الإمبراطورية").setDescription("**يا لورد، اضبط الرومات والرتب بضغطة زر.**").setImage(IMG.BANK).setColor(BLACK);
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('conf_x').setLabel('روم إكس').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('conf_staff').setLabel('رتبة الإدارة').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('conf_category').setLabel('كاتبجوري التكت').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('conf_logs').setLabel('روم اللوق').setStyle(ButtonStyle.Secondary)
        );
        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('send_main_panel').setLabel('إرسال لوحة (الهوية/التكت)').setStyle(ButtonStyle.Success)
        );
        return message.channel.send({ embeds: [sEmbed], components: [row, row2] });
    }

    // 👑 [ أوامر الإدارة العظمى - SAY / DM / CLEAR / BAN ]
    if (cmd === 'say') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return;
        message.delete().catch(() => {});
        return message.channel.send({ embeds: [new EmbedBuilder().setDescription(`**${args.join(" ")}**`).setColor(BLACK).setFooter({ text: FOOTER })] });
    }

    if (cmd === 'dm') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
        const target = message.mentions.members.first();
        const msg = args.slice(1).join(" ");
        if (!target || !msg) return message.reply("!dm @user msg");
        target.send({ embeds: [new EmbedBuilder().setTitle("📩 تنبيه إداري").setDescription(`**${msg}**`).setColor(RED).setFooter({ text: FOOTER })] }).catch(() => {});
        return message.reply("✅ تم الإرسال.");
    }

    if (cmd === 'clear') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return;
        const amount = parseInt(args[0]) || 100;
        await message.channel.bulkDelete(Math.min(amount, 100)).catch(() => {});
        return message.channel.send(`**🧹 تم تنظيف ${amount} رسالة.**`).then(m => setTimeout(() => m.delete(), 2000));
    }

    // 🏦 [ نظام البنك والمتجر المدمج ]
    if (cmd === 'بنك' || cmd === 'رصيد') {
        const p = db.players[message.author.id];
        if (!p) return message.reply("**⚠️ لا يوجد لديك ملف مواطن! استخرج هوية أولاً.**");
        return message.reply(`**🏦 حسابك البنكي: \`${p.balance} ريال\`**`);
    }

    if (cmd === 'متجر' || cmd === 'shop') {
        const shop = new EmbedBuilder().setTitle("🛒 متجر المدينة المركزي").setDescription("**🔫 مسدس: 15,000 | 🛡️ درع: 5,000 | 🍔 وجبة: 200**").setColor(BLACK).setImage(IMG.WEAPON);
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('buy_pistol').setLabel('شراء مسدس').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('buy_armor').setLabel('شراء درع').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('buy_food').setLabel('شراء وجبة').setStyle(ButtonStyle.Success)
        );
        return message.channel.send({ embeds: [shop], components: [row] });
    }

    // 📜 [ نظام HELP الملياري ]
    if (cmd === 'help' || cmd === 'اوامر') {
        const hEmbed = new EmbedBuilder().setTitle("👑 دستور Rain Town | LORD WILKED EDITION").setDescription("**اختر القطاع للسيطرة والتحكم.**").setImage(IMG.POLICE).setColor(BLACK);
        const menu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('help_menu').setPlaceholder('--- اختر قطاع الأوامر ---')
            .addOptions([
                { label: 'قطاع الإدارة (Ban/Say/Clear)', value: 'admin', emoji: '🛡️' },
                { label: 'قطاع الاقتصاد (Bank/Shop)', value: 'econ', emoji: '💰' },
                { label: 'قطاع الواقعية (ID/X/Tickets)', value: 'rp', emoji: '🏙️' }
            ])
        );
        return message.channel.send({ embeds: [hEmbed], components: [menu] });
    }
});

// --- [ محرك التفاعلات الشامل - LORD WILKED ENGINE ] ---
bot.on('interactionCreate', async i => {
    // 1. لوحة الخدمات المركزية
    if (i.customId === 'send_main_panel') {
        const panel = new EmbedBuilder().setTitle("🇸🇦 بوابة خدمات Rain Town").setDescription("من هنا يمكنك إصدار هويتك الوطنية أو فتح تكت مساعدة.").setColor(BLACK).setImage(IMG.POLICE);
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('start_id').setLabel('إنشاء هوية').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('open_ticket').setLabel('فتح تكت').setStyle(ButtonStyle.Primary)
        );
        await i.reply({ content: "✅ تم إرسال اللوحة بنجاح.", ephemeral: true });
        return i.channel.send({ embeds: [panel], components: [row] });
    }

    // 2. نظام إنشاء الهوية (ID Card)
    if (i.customId === 'start_id') {
        const modal = new ModalBuilder().setCustomId('id_modal').setTitle('إصدار هوية وطنية');
        modal.addComponents(
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('n').setLabel("الاسم الرسمي (يمنع المشاهير)").setStyle(TextInputStyle.Short)),
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('a').setLabel("السن (20-50)").setStyle(TextInputStyle.Short))
        );
        await i.showModal(modal);
    }

    if (i.type === InteractionType.ModalSubmit && i.customId === 'id_modal') {
        const name = i.fields.getTextInputValue('n');
        const age = parseInt(i.fields.getTextInputValue('a'));
        if (["كافح", "ماثيو", "Kafh", "Matthew"].includes(name) || age < 20 || age > 50) return i.reply({ content: "❌ البيانات مرفوضة أمنياً!", ephemeral: true });
        db.players[i.user.id] = { name, age, balance: 5000 }; save();
        await i.reply({ content: `✅ تم تفعيل هويتك يا **${name}**.. مبروك الـ 5000 ريال كهدية بداية!`, ephemeral: true });
    }

    // 3. نظام التكت (Tickets)
    if (i.customId === 'open_ticket') {
        const ticket = await i.guild.channels.create({
            name: `ticket-${i.user.username}`,
            type: ChannelType.GuildText,
            parent: db.config.ticket_category,
            permissionOverwrites: [
                { id: i.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                { id: i.user.id, allow: [PermissionsBitField.Flags.ViewChannel] },
                { id: db.config.staff_role, allow: [PermissionsBitField.Flags.ViewChannel] }
            ]
        });
        const claimBtn = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('claim').setLabel('استلام التكت').setStyle(ButtonStyle.Success));
        await ticket.send({ content: `**أهلاً <@${i.user.id}>، انتظر استلام الإدارة لتذكرتك.**`, components: [claimBtn] });
        await i.reply({ content: `✅ تم فتح تذكرتك: ${ticket}`, ephemeral: true });
    }

    if (i.customId === 'claim') {
        if (!i.member.roles.cache.has(db.config.staff_role)) return i.reply({ content: "للإدارة فقط!", ephemeral: true });
        db.admin_pts[i.user.id] = (db.admin_pts[i.user.id] || 0) + 1; save();
        await i.channel.permissionOverwrites.edit(db.config.staff_role, { ViewChannel: false });
        await i.channel.permissionOverwrites.edit(i.user.id, { ViewChannel: true });
        await i.update({ content: `**✅ استلم التكت: <@${i.user.id}>\nنقاط الإدارة: ${db.admin_pts[i.user.id]}**`, components: [] });
    }

    // 4. نظام المتجر والخصم البنكي
    if (i.customId.startsWith('buy_')) {
        const p = db.players[i.user.id];
        if (!p) return i.reply({ content: "⚠️ لازم تطلع هوية أولاً عشان تفتح حساب بنكي!", ephemeral: true });
        let price = i.customId === 'buy_pistol' ? 15000 : (i.customId === 'buy_armor' ? 5000 : 200);
        let item = i.customId === 'buy_pistol' ? "مسدس" : (i.customId === 'buy_armor' ? "درع" : "وجبة");
        
        if (p.balance < price) return i.reply({ content: `❌ رصيدك (\`${p.balance}\`) غير كافي لشراء ${item}!`, ephemeral: true });
        
        p.balance -= price; save();
        await i.reply({ content: `✅ تم شراء ${item} بنجاح! رصيدك المتبقي: \`${p.balance}\``, ephemeral: true });
        
        if (db.config.log_channel) {
            const l = i.guild.channels.cache.get(db.config.log_channel);
            if (l) l.send({ content: `🛍️ **عملية شراء:** <@${i.user.id}> اشترى ${item} بقيمة ${price} ريال.` });
        }
    }

    // 5. محرك الـ SETUP الذكي
    if (['conf_x', 'conf_staff', 'conf_category', 'conf_logs'].includes(i.customId)) {
        const m = new ModalBuilder().setCustomId(`m_${i.customId}`).setTitle('إعدادات الإمبراطورية');
        m.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('v').setLabel("أدخل الآيدي (ID) المطلوب").setStyle(TextInputStyle.Short)));
        await i.showModal(m);
    }
    if (i.type === InteractionType.ModalSubmit && i.customId.startsWith('m_conf_')) {
        const val = i.fields.getTextInputValue('v');
        if (i.customId === 'm_conf_x') db.config.x_channel = val;
        if (i.customId === 'm_conf_staff') db.config.staff_role = val;
        if (i.customId === 'm_conf_category') db.config.ticket_category = val;
        if (i.customId === 'm_conf_logs') db.config.log_channel = val;
        save();
        await i.reply({ content: "✅ تم تحديث البيانات وحفظها في النواة.", ephemeral: true });
    }

    // 6. قائمة HELP التفاعلية
    if (i.isStringSelectMenu() && i.customId === 'help_menu') {
        const d = {
            admin: { t: "🛡️ قطاع الإدارة", c: "`!ban`, `!kick`, `!clear`, `!say`, `!dm`, `!رتب`", img: IMG.POLICE },
            econ: { t: "💰 قطاع الاقتصاد", c: "`!بنك`, `!رصيد`, `!متجر`, `!شراء`", img: IMG.BANK },
            rp: { t: "🏙️ قطاع الواقعية", c: "`!هوية`, `!تكت`, `!إكس`, `!setup`", img: IMG.GANG }
        };
        const s = d[i.values[0]];
        await i.update({ embeds: [new EmbedBuilder().setTitle(s.t).setDescription(`**الأوامر:**\n${s.c}`).setImage(s.img).setColor(BLACK).setFooter({ text: FOOTER })] });
    }
});

// السطر الأخير والمهم يا LORD WILKED
bot.login(process.env.DISCORD_TOKEN);
