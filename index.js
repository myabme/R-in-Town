/**
 * 👑 PROJECT: RAIN TOWN ULTIMATE CORE
 * 👨‍💻 DEVELOPER: WILKED (LORD S)
 * 🛡️ VERSION: 100.0.0 (FINAL ATOMIC VERSION)
 * 📂 FILE: index.js
 */

const { 
    Client, GatewayIntentBits, ActivityType, EmbedBuilder, ActionRowBuilder, 
    StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, 
    ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType 
} = require('discord.js');
const fs = require('fs');

// --- [ إنشاء البوت بجميع الصلاحيات ] ---
const bot = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent, 
        GatewayIntentBits.GuildMembers
    ] 
});

const BLACK = 0x000000;
const FOOTER = "Developed by Wilked | Rain Town Overlord V100";
const DB_FILE = './wilked_database.json';

// --- [ محرك قاعدة البيانات ] ---
let db = { players: {}, config: { verified_role: "ID_رتبة_التفعيل", logs: null } };
if (fs.existsSync(DB_FILE)) db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
const save = () => fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 4));

// --- [ درع Wilked: حماية الدين والأهل والسب ] ---
const HOLY_SHIELD = [/رب/g, /دين/g, /الله/g, /امك/g, /ابوك/g, /اهلك/g, /عرض/g, /شرف/g];
const BAD_WORDS = ["قحبه", "منيوك", "زق", "كلب", "تفو", "ورع", "خنيث", "قواد"];

// --- [ مصفوفة المليار أمر (إدارة، قراند، عصابات، دولة) ] ---
const MATRIX = {
    GOVERNMENT: ["هوية", "جوازات", "داخلية", "خارجية", "صحة", "مرور", "سجل_مدني", "تجديد_اقامة", "بصمة", "منع_سفر"],
    GANGS: ["تهريب", "غسيل_اموال", "مخدرات", "اغتيال", "خطف", "سطو_مسلح", "سوق_سوداء", "سلاح_ممسوح", "فدية"],
    ECONOMY: ["بنك", "راتب", "تحويل", "قرض", "إيكيا", "ميناء", "جمارك", "شراء_قصر", "استثمار", "كشف_حساب"],
    ADMIN_COMMANDS: ["ban", "kick", "mute", "clear", "say", "dm", "رتب", "سجن", "طرد", "قفل", "فتح", "تفعيل_يدوي"],
    MILITARY: ["جيش", "استخبارات", "قوات_خاصة", "طيران_حربي", "نووي", "رادار", "تجنيد", "قناص", "مداهمة"]
};

bot.once('ready', () => {
    bot.user.setPresence({ 
        activities: [{ name: 'Rain Town Singularity | Developed by Wilked', type: ActivityType.Streaming, url: 'https://twitch.tv/wilked' }],
        status: 'dnd' 
    });
    console.log(`✅ [WILKED CORE] Logged in as ${bot.user.tag}`);
});

bot.on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return;

    // 🛡️ [ درع الحماية الذكي ]
    const content = message.content.toLowerCase();
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        if (HOLY_SHIELD.some(p => p.test(content)) || BAD_WORDS.some(w => content.includes(w))) {
            message.delete().catch(() => {});
            return message.channel.send(`**⚠️ انتبه! مدينة Rain Town مدينة راقية.. يمنع المساس بالدين أو الأهل يا {${message.author.username}}!**`).then(m => setTimeout(() => m.delete(), 3000));
        }
    }

    if (!message.content.startsWith('!')) return;
    const args = message.content.slice(1).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();

    // 🏗️ [ نظام SETUP الشامل ]
    if (cmd === 'setup_all') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
        
        const mainEmbed = new EmbedBuilder()
            .setTitle("🇸🇦 بوابة Rain Town الإلكترونية")
            .setDescription("**نظام التفعيل الموحد، البنوك، والوزارات الحكومية.**")
            .setImage("http://googleusercontent.com/image_collection/image_retrieval/3475788120413027980_1")
            .setColor(BLACK).setFooter({ text: FOOTER });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('start_verify').setLabel('تفعيل الهوية').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('open_bank').setLabel('البنك المركزي').setStyle(ButtonStyle.Primary)
        );

        return message.channel.send({ embeds: [mainEmbed], components: [row] });
    }

    // 📢 [ أوامر الإدارة الأساسية ]
    if (cmd === 'say') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return;
        message.delete().catch(() => {});
        return message.channel.send({ embeds: [new EmbedBuilder().setDescription(`**${args.join(" ")}**`).setColor(BLACK).setFooter({ text: FOOTER })] });
    }

    if (cmd === 'dm') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
        const target = message.mentions.members.first();
        if (!target) return message.reply("**⚠️ منشن الشخص!**");
        target.send(`**__[✉️] رسالة إدارية: ${args.slice(1).join(" ")}__**`).catch(() => {});
        return message.reply("✅ تم الإرسال.");
    }

    if (cmd === 'رتب') {
        const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(r => `${r.name} | ID: ${r.id}`).join('\n');
        fs.writeFileSync('./roles.txt', roles);
        await message.reply({ files: ['./roles.txt'] });
        return fs.unlinkSync('./roles.txt');
    }

    // ❓ [ نظام الأسئلة التفاعلية ]
    if (cmd === 'سؤال') {
        const questions = ["ما هو اسم مبرمج البوت؟", "من هو حاكم المدينة؟", "ما هو نظام الحماية المفعّل؟"];
        const q = questions[Math.floor(Math.random() * questions.length)];
        return message.reply(`**❓ سؤال التفاعل: { ${q} }**`);
    }

    // 🎮 [ معالجة المليار أمر ]
    for (const [cat, list] of Object.entries(MATRIX)) {
        if (list.includes(cmd)) {
            return message.channel.send({ 
                embeds: [new EmbedBuilder()
                    .setTitle(`💎 نظام {${cat}} المليوني`)
                    .setDescription(`**__[✅] تم تنفيذ أمر: {${cmd}}\nالمواطن: {${message.author.username}}\nالحالة:Developed by Wilked..__**`)
                    .setColor(BLACK).setFooter({ text: FOOTER })] 
            });
        }
    }
});

// --- [ نظام التفاعلات والـ Modals ] ---
bot.on('interactionCreate', async i => {
    if (i.customId === 'start_verify') {
        const modal = new ModalBuilder().setCustomId('v_modal').setTitle('نظام التفعيل الرسمي');
        modal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('n').setLabel("الاسم الرباعي").setStyle(TextInputStyle.Short)));
        await i.showModal(modal);
    }

    if (i.type === InteractionType.ModalSubmit && i.customId === 'v_modal') {
        const name = i.fields.getTextInputValue('n');
        db.players[i.user.id] = { name: name, bank: 5000, cash: 0 };
        save();
        await i.reply({ content: `✅ أهلاً بك يا لورد **${name}**، تم تفعيلك في قاعدة بيانات Wilked!`, ephemeral: true });
    }

    if (i.customId === 'open_bank') {
        const p = db.players[i.user.id] || { bank: 0 };
        await i.reply({ content: `🏦 **رصيدك الحالي في بنك Rain Town هو: ${p.bank} ريال.**`, ephemeral: true });
    }
});

// --- [ تشغيل البوت ] ---
bot.login(process.env.DISCORD_TOKEN);
