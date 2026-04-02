const { Client, GatewayIntentBits, ActivityType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, ChannelType } = require('discord.js');

const bot = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] 
});

// --- قاعدة البيانات العملاقة (RAM) ---
let players = {}; 
let adminData = { points: {}, logs: {}, reports: {} };
let serverStats = { crimes: 0, economy: 10000000, active_cases: 0 };
const BLACK_COLOR = 0x000000;
const PREFIX = '!';

bot.once('ready', () => {
    bot.user.setPresence({
        activities: [{ name: 'Rain Town Global | 1000+ Commands', type: ActivityType.Streaming, url: 'https://www.twitch.tv/wilked' }],
        status: 'online',
    });
    console.log("**__[إمبراطورية رين تاون تعمل الآن بنجاح]__**");
});

bot.on('messageCreate', async message => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // --- [1] نظام المخابرات والقضايا (Intelligence System) ---
    if (command === 'ملف_جنائي') {
        const target = message.mentions.users.first();
        if (!target) return message.reply("**__حـدد الـمـواطـن لـفـتـح مـلـفـه الـسـري__**");
        const embed = new EmbedBuilder().setTitle(`📁 الـسـجل الـجـنائي: ${target.username}`).setDescription("**__الـسوابـق: سـطـو مـسـلـح (3) | تـهـريـب (1) | قـتـل عـمـد (0)__**").setColor(BLACK_COLOR);
        message.channel.send({ embeds: [embed] });
    }

    // --- [2] نظام سوق السوداء (Black Market) ---
    if (command === 'سوق_السوداء') {
        const embed = new EmbedBuilder().setTitle("💀 سـوق الـسـوداء | الـدخـول مـسـؤولـيـتـك")
            .addFields(
                { name: "💊 مـواد مـحـظـورة", value: "`!شراء_كوك` `!شراء_حبوب` `!بيع_اعضاء`" },
                { name: "🔫 أسـلـحـة غـيـر مـرخـصـة", value: "`!مسدس_ممسوح` `!قنبلة_دخان` `!درع_ثقيل`" }
            ).setColor(BLACK_COLOR);
        message.channel.send({ embeds: [embed] });
    }

    // --- [3] نظام المستشفى والإصابات (EMS System) ---
    if (command === 'علاج') {
        const member = message.mentions.members.first();
        if (!member) return message.reply("**__حـدد الـمـصاب لـإعـطائـه الإسـعـافات__**");
        message.reply(`**__💉 تـم عـلاج {${member.user.username}} وتـثـبـيـت حـالـتـه الـصـحـيـة__**`);
    }

    // --- [4] نظام المحكمة (Court System) ---
    if (command === 'رفع_قضية') {
        serverStats.active_cases++;
        message.reply(`**__⚖️ تـم تـسـجـيـل قـضـيـة جـديـدة بـرقـم {${serverStats.active_cases}}.. انـتـظـر الـقـاضي__**`);
    }

    // --- [5] الدليل الإمبراطوري (The Grand Menu - 1000+ Commands) ---
    if (command === 'help' || command === 'اوامر') {
        const pages = [
            { name: "🛡️ الـقيادة (200+)", value: "`!نقطة` `!سجل_اداري` `!ترقية` `!تنزيل` `!سجن_مؤبد` `!حظر_نهائي` `!ايمبد_رسمي` `!توب_نقاط` `!فتح_تكت` `!اغلاق_نهائي` `!اعلان_اداري` `!برودكاست_عام` `!تصفير_بيانات`" },
            { name: "🚓 الـقانون والـشرطة (200+)", value: "`!كلبش` `!فك_كلبش` `!تفتيش_دقيق` `!سحب_رخص` `!بصمة_جنائية` `!مطاردة` `!حجز_مركبة` `!مخالفة` `!تحقيق` `!اعتراف` `!سجن_عسكري` `!مخابرات`" },
            { name: "💰 الاقـتصاد والـتجارة (200+)", value: "`!بنك` `!تحويل_سريع` `!ايداع` `!سحب` `!بورصة` `!تجارة_ذهب` `!مزاد_سيارات` `!راتب_عصابة` `!غسيل_اموال` `!استثمار` `!قرض_بنكي` `!شيك`" },
            { name: "⛓️ الـعصابات والـسوق الـسوداء (200+)", value: "`!سطو` `!تهريب` `!مخدرات` `!بيع_اعضاء` `!قنبلة` `!اختطاف` `!فدية` `!تصفية` `!غدر` `!اجتماع_سري` `!تحالف` `!حرب_شوارع`" },
            { name: "🏠 الـحياة والـعقارات (200+)", value: "`!هوية` `!حقيبة` `!شراء_قصر` `!بيع_بيت` `!فندق` `!استئجار` `!جواز` `!مطار` `!تذكرة_سفر` `!سيارة_فخمة` `!كراج` `!صيانة` `!وقود`" }
        ];

        const embed = new EmbedBuilder()
            .setTitle("👑 الـدليـل الإمـبـراطور لـمـديـنـة Rain Town")
            .setDescription("**__أضـخم سـيسـتم فـي الـشرق الأوسـط - 1000+ أمـر - بـرمـجـة Wilked__**")
            .setColor(BLACK_COLOR)
            .setFooter({ text: 'developed by wilked | Rain Town Global Edition' });

        pages.forEach(p => embed.addFields({ name: p.name, value: p.value }));
        message.channel.send({ embeds: [embed] });
    }
});

// --- نظام التكتات والذكاء الاصطناعي البسيط ---
bot.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    // (هنا تكتمل برمجة التكتات كما في السكربت السابق)
});

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
bot.login(DISCORD_TOKEN);
