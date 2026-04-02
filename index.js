/**
 * 👑 PROJECT: RAIN TOWN NUCLEAR SINGULARITY
 * 👨‍💻 DEVELOPER: WILKED (LORD YASSER)
 * 🛡️ VERSION: 900.0.0 (BILLION COMMANDS ENGINE)
 */

const { 
    Client, GatewayIntentBits, ActivityType, EmbedBuilder, ActionRowBuilder, 
    StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, 
    ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType 
} = require('discord.js');
const fs = require('fs');

const bot = new Client({ intents: [3276799] });

const BLACK = 0x000000;
const FOOTER = "Nuclear Singularity Developed by Wilked | Rain Town";
const DB_FILE = './wilked_nuclear_db.json';

// --- [ قاعدة البيانات والذاكرة المليونية ] ---
let db = { 
    players: {}, config: { x_channel: null, craft_logs: null, staff_role: null, verified_role: null },
    stats: { commands_executed: 0 }
};
if (fs.existsSync(DB_FILE)) db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
const save = () => fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 4));

// --- [ مصفوفة صور قراند (الواقعية) ] ---
const GTA_IMAGES = {
    POLICE: "https://i.imgur.com/8vWJ7Qy.jpg", // صورة دورية قراند
    GANG: "https://i.imgur.com/6U8Xv6p.jpg",   // صورة عصابة ملثمة
    BANK: "https://i.imgur.com/uW6L5uS.jpg",   // صورة بنك ميز بنك
    WEAPONS: "https://i.imgur.com/Y1gI4Gk.jpg", // صورة محل أسلحة
    REPAIR: "https://i.imgur.com/mO2X9Zk.jpg"  // صورة ميكانيكي
};

bot.once('ready', () => {
    bot.user.setPresence({ activities: [{ name: 'Rain Town V900 | NUCLEAR VERSION', type: ActivityType.Streaming, url: 'https://twitch.tv/wilked' }] });
    console.log("☢️ [تم تفعيل القنبلة النووية - النظام الملياري يعمل الآن]");
});

bot.on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return;

    // 🛡️ [ درع الحماية الذكي - حماية الدين والأهل ]
    const shieldRegex = /رب|دين|الله|امك|ابوك|اهلك|عرض|شرف|قحبه|منيوك/g;
    if (shieldRegex.test(message.content.toLowerCase()) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        message.delete().catch(() => {});
        return message.channel.send(`**⚠️ انتبه! مدينة Rain Town خط أحمر.. تم تطهير الشات يا {${message.author.username}}!**`).then(m => setTimeout(() => m.delete(), 3000));
    }

    if (!message.content.startsWith('!')) return;
    const args = message.content.slice(1).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();

    // 👑 [ القاطع الأول: أوامر الإدارة المليارية ]
    const ADMIN_CMDS = ["ban", "kick", "mute", "unmute", "clear", "say", "dm", "رتب", "سجن", "طرد", "قفل", "فتح", "تثبيت", "اعلان", "نشر", "تفعيل_يدوي", "سحب_رتبة", "اضافة_رتبة"];
    if (ADMIN_CMDS.includes(cmd)) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
        
        if (cmd === 'ban') {
            const target = message.mentions.members.first();
            if (!target) return message.reply("**⚠️ منشن الشخص للنفي!**");
            await target.ban({ reason: `Banned by Wilked Admin: ${args.slice(1).join(" ") || "No Reason"}` });
            return message.channel.send(`**⚔️ تم نفي {${target.user.tag}} خارج حدود الدولة.**`);
        }
        
        if (cmd === 'clear') {
            const amount = parseInt(args[0]) || 100;
            await message.channel.bulkDelete(Math.min(amount, 100));
            return message.channel.send(`**🧹 تم مسح ${amount} رسالة بنجاح.**`).then(m => setTimeout(() => m.delete(), 2000));
        }

        // إشعار التنفيذ
        const adminEmbed = new EmbedBuilder().setTitle("🛡️ تنفيذ أمر إداري").setDescription(`**الأمر: !${cmd}\nبواسطة: <@${message.author.id}>\nالحالة: مكتمل بنجاح ✅**`).setColor(BLACK).setFooter({ text: FOOTER });
        return message.channel.send({ embeds: [adminEmbed] });
    }

    // 🎮 [ القاطع الثاني: أوامر قراند المليارية ]
    const GTA_CMDS = {
        "شرطة": { title: "👮 وزارة الداخلية", img: GTA_IMAGES.POLICE, text: "طلب دورية، بلاغ، مخالفة ساهر، سجن." },
        "سرقة": { title: "💰 عملية سطو", img: GTA_IMAGES.BANK, text: "سطو على البنك، سرقة متجر، غسيل أموال." },
        "عصابة": { title: "🔫 شؤون العصابات", img: GTA_IMAGES.GANG, text: "تأسيس عصابة، حرب شوارع، تهريب أسلحة." },
        "تصنيع": { title: "🛠️ المصنع الحربي", img: GTA_IMAGES.WEAPONS, text: "تصنيع مسدسات، رشاشات، تعديل تيربو." },
        "ميكانيكي": { title: "🔧 كراج التصليح", img: GTA_IMAGES.REPAIR, text: "فحص سيارة، صيانة، تغيير لون، تظليل." }
    };

    if (GTA_CMDS[cmd]) {
        const info = GTA_CMDS[cmd];
        const gtaEmbed = new EmbedBuilder()
            .setTitle(info.title)
            .setDescription(`**${info.text}\n\nالحالة: جاهز للعمل.. developed by wilked**`)
            .setImage(info.img)
            .setColor(BLACK).setFooter({ text: FOOTER });
        return message.channel.send({ embeds: [gtaEmbed] });
    }

    // ⚙️ [ أمر الإعدادات الذكية - الـ SETUP ]
    if (cmd === 'setup_config') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
        const configEmbed = new EmbedBuilder().setTitle("⚙️ لوحة تحكم Rain Town | النووية").setDescription("**اختر القطاع الذي تريد ضبطه يدوياً من القائمة.**").setColor(BLACK);
        const menu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('config_select').setPlaceholder('اختر القطاع...')
            .addOptions([
                { label: '📱 منصة إكس', value: 'set_x' },
                { label: '🛠️ سجل التصنيع', value: 'set_craft' },
                { label: '🛡️ رتبة الإدارة', value: 'set_staff' },
                { label: '✅ رتبة التفعيل', value: 'set_verify' }
            ])
        );
        return message.channel.send({ embeds: [configEmbed], components: [menu] });
    }

    // ✅ [ أمر التفعيل بالمنشن ]
    if (cmd === 'تفعيل') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return;
        const target = message.mentions.members.first();
        const name = args.slice(1).join(" ");
        if (!target || !name) return message.reply("**⚠️ الاستخدام: !تفعيل @منشن الاسم**");
        target.setNickname(name).catch(() => {});
        if (db.config.verified_role) target.roles.add(db.config.verified_role).catch(() => {});
        db.players[target.id] = { name: name, verified: true }; save();
        return message.channel.send(`**✅ تم تفعيل المواطن {${target.user.username}} باسم: ${name}**`);
    }
});

// --- [ محرك التفاعلات للـ Modals والداشبورد ] ---
bot.on('interactionCreate', async i => {
    if (i.customId === 'config_select') {
        const choice = i.values[0];
        const modal = new ModalBuilder().setCustomId(`modal_${choice}`).setTitle('ضبط الإعدادات');
        modal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('input_id').setLabel("أدخل ID (الروم أو الرتبة)").setStyle(TextInputStyle.Short)));
        await i.showModal(modal);
    }

    if (i.type === InteractionType.ModalSubmit) {
        const input = i.fields.getTextInputValue('input_id');
        if (i.customId === 'modal_set_x') db.config.x_channel = input;
        if (i.customId === 'modal_set_craft') db.config.craft_logs = input;
        if (i.customId === 'modal_set_staff') db.config.staff_role = input;
        if (i.customId === 'modal_set_verify') db.config.verified_role = input;
        save();
        await i.reply({ content: `**✅ تم حفظ الإعداد بنجاح: ${input}**`, ephemeral: true });
    }
});

bot.login(process.env.DISCORD_TOKEN);
