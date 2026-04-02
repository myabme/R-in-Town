/**
 * 👑 PROJECT: RAIN TOWN SINGULARITY (THE ATOMIC SCRIPT)
 * 👨‍💻 DEVELOPER: WILKED (LORD YASSER)
 * 🛡️ VERSION: 100.0.0 (ULTIMATE CONVERGENCE)
 * 📜 LOGIC: GOVERNMENT + GANGS + SECURITY + AUTO-SYSTEMS
 */

const { 
    Client, GatewayIntentBits, ActivityType, EmbedBuilder, ActionRowBuilder, 
    StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, 
    ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType,
    Collection 
} = require('discord.js');
const fs = require('fs');

const bot = new Client({ intents: [3276799] });

const BLACK = 0x000000;
const GOLD = 0xD4AF37;
const FOOTER = "Developed by Wilked | Rain Town Overlord V100";
const DB_FILE = './wilked_singularity_db.json';

// --- [ قاعدة البيانات العظمى ] ---
let db = { players: {}, config: { verified_role: "ID_رتبة_التفعيل", logs: null }, tickets: 0 };
if (fs.existsSync(DB_FILE)) db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
const save = () => fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 4));

// --- [ مصفوفات الحماية النووية ] ---
const HOLY_SHIELD = [/رب/g, /دين/g, /الله/g, /امك/g, /ابوك/g, /اهلك/g, /عرض/g, /شرف/g];
const BAD_WORDS = ["قحبه", "منيوك", "زق", "كلب", "تفو", "ورع", "خنيث", "قواد"];

// --- [ مصفوفات الأوامر (المليار أمر) ] ---
const COMMAND_MATRIX = {
    GOVERNMENT: ["هوية", "جوازات", "داخلية", "خارجية", "صحة", "تعليم", "مرور", "سجل_مدني", "تجديد_اقامة", "بصمة", "منع_سفر"],
    GANGS: ["تهريب", "غسيل_اموال", "مخدرات", "اغتيال", "خطف", "سطو_مسلح", "سوق_سوداء", "سلاح_ممسوح", "تشفير_جهاز", "فدية"],
    ECONOMY: ["بنك", "راتب", "تحويل", "قرض", "إيكيا", "ميناء", "جمارك", "شراء_قصر", "استثمار", "تداول", "كشف_حساب"],
    ADMIN: ["ban", "kick", "mute", "clear", "say", "dm", "رتب", "سجن", "طرد", "قفل", "فتح", "اعلان", "تثبيت", "تفعيل_يدوي"],
    MILITARY: ["جيش", "استخبارات", "قوات_خاصة", "طيران_حربي", "غواصة", "نووي", "رادار", "تجنيد", "قناص", "مداهمة"]
};

bot.once('ready', () => {
    bot.user.setPresence({ activities: [{ name: 'Rain Town Singularity | Wilked V100', type: ActivityType.Streaming, url: 'https://twitch.tv/wilked' }] });
    console.log("🔥 [تم تفعيل القنبلة النووية - إمبراطورية Rain Town تحت السيطرة المطلقة]");
});

bot.on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return;

    // 🛡️ [ الدرع النووي: حماية الدين والأهل ]
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        if (HOLY_SHIELD.some(p => p.test(message.content)) || BAD_WORDS.some(w => message.content.includes(w))) {
            message.delete().catch(() => {});
            return message.channel.send(`**⚠️ انتبه! مدينة Rain Town خط أحمر.. يمنع المساس بالثوابت يا {${message.author.username}}!**`);
        }
    }

    if (!message.content.startsWith('!')) return;
    const args = message.content.slice(1).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();

    // 🏗️ [ نظام الـ Setup الشامل: تفعيل + وزارات + عصابات ]
    if (cmd === 'setup_all') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

        // إيمبد التفعيل
        const verifyEmbed = new EmbedBuilder().setTitle("✅ مركز التفعيل الوطني").setDescription("**اضغط على الزر أدناه لإصدار هويتك وتفعيل عضويتك في الدولة.**").setColor(BLACK);
        const verifyRow = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('start_verify').setLabel('تفعيل الآن').setStyle(ButtonStyle.Success));

        // إيمبد الوزارات
        const govEmbed = new EmbedBuilder().setTitle("🇸🇦 بوابة ناجز | الخدمات الحكومية").setDescription("**الوصول لجميع وزارات الدولة: الداخلية، الجوازات، والمالية.**").setColor(BLACK);
        const govRow = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('gov_menu').setLabel('فتح البوابة').setStyle(ButtonStyle.Primary));

        await message.channel.send({ embeds: [verifyEmbed], components: [verifyRow] });
        await message.channel.send({ embeds: [govEmbed], components: [govRow] });
    }

    // 📢 [ أوامر SAY & DM ]
    if (cmd === 'say') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return;
        message.delete().catch(() => {});
        return message.channel.send({ embeds: [new EmbedBuilder().setDescription(`**${args.join(" ")}**`).setColor(BLACK).setFooter({ text: FOOTER })] });
    }

    if (cmd === 'dm') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
        const target = message.mentions.members.first();
        if (!target) return;
        target.send(`**__[✉️] رسالة من إدارة Rain Town: ${args.slice(1).join(" ")}__**`).catch(() => message.reply("❌ خاص الشخص مغلق."));
        return message.reply("✅ تم الإرسال.");
    }

    // 🎖️ [ أمر رتب ]
    if (cmd === 'رتب') {
        const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(r => `${r.name} - ${r.id}`).join('\n');
        fs.writeFileSync('./roles.txt', roles);
        await message.reply({ files: ['./roles.txt'] });
        return fs.unlinkSync('./roles.txt');
    }

    // ❓ [ نظام الأسئلة التلقائي ]
    if (cmd === 'سؤال') {
        const questions = ["ما هو عاصمة الدولة؟", "من هو مؤسس Rain Town؟", "كم ميزانية الجيش؟"];
        const q = questions[Math.floor(Math.random() * questions.length)];
        return message.reply(`**❓ سؤال التنشيط: ${q}**`);
    }

    // 🎮 [ محرك المليار أمر للرد الذكي ]
    for (const [cat, list] of Object.entries(COMMAND_MATRIX)) {
        if (list.includes(cmd)) {
            return message.channel.send({ embeds: [new EmbedBuilder().setTitle(`💎 نظام {${cat}}`).setDescription(`**__[✅] تنفيذ أمر: {${cmd}}\nالمواطن: {${message.author.username}}\nالحالة: نظام Wilked يعمل..__**`).setColor(BLACK).setFooter({ text: FOOTER })] });
        }
    }
});

// --- [ التفاعلات والـ Modals (التفعيل والوزارات) ] ---
bot.on('interactionCreate', async i => {
    if (i.customId === 'start_verify') {
        const modal = new ModalBuilder().setCustomId('verify_modal').setTitle('نظام التفعيل الموحد');
        modal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('real_name').setLabel("الاسم الرباعي").setStyle(TextInputStyle.Short)));
        await i.showModal(modal);
    }

    if (i.type === InteractionType.ModalSubmit && i.customId === 'verify_modal') {
        const name = i.fields.getTextInputValue('real_name');
        db.players[i.user.id] = { name: name, bank: 5000, cash: 0, job: "مواطن" };
        save();
        const role = i.guild.roles.cache.get(db.config.verified_role);
        if (role) i.member.roles.add(role).catch(() => {});
        await i.reply({ content: `✅ تم تفعيلك يا لورد **${name}** بنجاح!`, ephemeral: true });
    }
});

bot.login("DISCORD_TOKEN");
