const { Client, GatewayIntentBits, ActivityType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, PermissionsBitField, ChannelType } = require('discord.js');

const bot = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent, 
        GatewayIntentBits.GuildMembers
    ] 
});

// --- إعدادات النظام وقاعدة البيانات المؤقتة ---
const BLACK = 0x000000;
const FOOTER = "developed by wilked";
const PREFIX = "!";

let botPermissions = {
    police: "شرطة",   // الرتبة الافتراضية للشرطة
    admin: "إدارة",    // الرتبة الافتراضية للإدارة
    gang: "عصابة"      // الرتبة الافتراضية للعصابات
};

let players = {}; 

bot.once('ready', () => {
    bot.user.setPresence({
        activities: [{ name: 'Rain Town V5 | Developed By Wilked', type: ActivityType.Streaming, url: 'https://twitch.tv/wilked' }],
        status: 'online',
    });
    console.log("**__[نظام رين تاون الإمبراطوري جاهز للعمل]__**");
});

bot.on('messageCreate', async message => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // --- 1. [نظام تعديل الصلاحيات الذكي] ---
    if (command === 'رتب') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
        const type = args[0]; // (شرطة / إدارة / عصابة)
        const newRole = args.slice(1).join(" ");
        if (!type || !newRole) return message.reply("**__اسـتـخـدم: `!رتب [النوع] [الاسم]` (مـثلاً: !رتب شرطة عسكر)__**");
        
        if (botPermissions[type] !== undefined) {
            botPermissions[type] = newRole;
            message.reply(`**__[✅] تـم تـحـديـث رتـبـة {${type}} إلـى {${newRole}} بـنـجـاح__**`);
        }
    }

    // --- 2. [نظام Say الاحترافي] ---
    if (command === 'say') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return;
        const mode = args[0]; // (ايمبد / عادي)
        const text = args.slice(1).join(" ");
        if (!mode || !text) return message.reply("**__اسـتـخـدم: `!say [ايمبد/عادي] [النص]`__**");

        if (mode === 'ايمبد') {
            const embed = new EmbedBuilder().setDescription(`**__${text}__**`).setColor(BLACK).setFooter({ text: FOOTER });
            message.channel.send({ embeds: [embed] });
        } else {
            message.channel.send(text);
        }
        message.delete().catch(() => {});
    }

    // --- 3. [نظام DM للشخص أو الرتبة] ---
    if (command === 'dm') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
        const target = message.mentions.members.first() || message.mentions.roles.first();
        const msg = args.slice(1).join(" ");
        if (!target || !msg) return message.reply("**__اسـتـخـدم: `!dm [@user/@role] [النص]`__**");

        if (target.user) { // إرسال لشخص
            target.send(`**__[✉️] رسـالـة إداريـة خـاصـة:\n\n${msg}__**`).catch(() => message.reply("❌ خـاص الـعـضـو مـغـلـق"));
            message.reply(`**__[✅] تـم الإرسـال لـ {${target.user.username}}__**`);
        } else { // إرسال لرتبة كاملة
            target.members.forEach(m => m.send(`**__[📢] تـنـبـيـه لـرتـبـة {${target.name}}:\n\n${msg}__**`).catch(() => {}));
            message.reply(`**__[✅] جـارٍ الإرسـال لـكـافـة أعـضـاء رتـبـة {${target.name}}__**`);
        }
    }

    // --- 4. [نظام المساعدة المبوب (Buttons Help)] ---
    if (command === 'help' || command === 'اوامر') {
        const embed = new EmbedBuilder()
            .setTitle("👑 لوحة تحكم Rain Town | Wilked System")
            .setDescription("**__مـرحـبـاً بـك يـا لـورد.. اضـغـط عـلى الـفـئـة لـرؤيـة الأوامـر الـمخـتـصـرة:__**")
            .setColor(BLACK).setFooter({ text: FOOTER });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('h_admin').setLabel('🛡️ الإدارة').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('h_police').setLabel('👮 الشرطة').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('h_gang').setLabel('🔥 العصابات').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('h_bank').setLabel('💰 البنك').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('h_life').setLabel('👥 الحياة').setStyle(ButtonStyle.Secondary)
        );
        message.channel.send({ embeds: [embed], components: [row] });
    }

    // --- أمثلة لأوامر الرتب (شرطة) ---
    if (command === 'تفتيش') {
        if (!message.member.roles.cache.some(r => r.name === botPermissions.police)) return message.reply("**__عـذراً، هـذا الأمـر مـخصص لـرتـبـة الـشـرطـة فـقـط!__**");
        const user = message.mentions.users.first();
        if (!user) return message.reply("**__يـرجى مـنـشـنة الـشخص لـتـفـتـيـشـه__**");
        message.reply(`**__[🔎] تـم تـفـتـيـش {${user.username}}.. والـوضـع سـلـيـم__**`);
    }
});

// --- معالجة أزرار الهيلب والقوائم ---
bot.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    let list = "";
    if (interaction.customId === 'h_admin') list = "**`!رتب` `!نقطة` `!سجن` `!طرد` `!حظر` `!say` `!dm` `!مسح`**";
    if (interaction.customId === 'h_police') list = "**`!تفتيش` `!كلبش` `!بصمة` `!سلاح` `!مخالفة` `!حجز` `!مطاردة`**";
    if (interaction.customId === 'h_gang') list = "**`!تهريب` `!غسيل` `!سطو` `!خطف` `!فزعة` `!مخدرات`**";
    if (interaction.customId === 'h_bank') list = "**`!بنك` `!مال` `!تحويل` `!ايداع` `!سحب` `!راتب` `!مزاد`**";
    if (interaction.customId === 'h_life') list = "**`!هوية` `!حقيبة` `!وظيفة` `!بيت` `!سيارة` `!جوال` `!اكس`**";

    await interaction.reply({ content: `🛠️ **أوامـر الـقـسـم الـمـخـتـارة:**\n${list}`, ephemeral: true });
});

bot.login(process.env.DISCORD_TOKEN);
