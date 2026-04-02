const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, ActivityType } = require('discord.js');
const fs = require('fs');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent, 
        GatewayIntentBits.GuildMembers
    ]
});

const prefix = "!";
const devName = "Wilked";
const serverName = "Rain Town";

// --- [ قائمة الحماية: سب، دين، عنصرية ] ---
const bannedWords = ["كافر", "ملحد", "نيجا", "عبد", "كلب", "حمار"]; 

client.on('ready', () => {
    console.log(`${serverName} Bot is Online | Developed by ${devName}`);
    client.user.setActivity(`${serverName} RP 🌧️`, { type: ActivityType.Competing });
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();

    // --- [ 1. نظام الحماية الذكي ] ---
    
    // منع الإنجليزي (عربي فقط)
    const englishRegex = /[a-zA-Z]/;
    if (englishRegex.test(message.content) && !message.content.startsWith(prefix)) {
        await message.delete().catch(() => {});
        return message.channel.send(`⚠️ **|** عذراً، مديـنة **${serverName}** تدعم اللغة العربية فقط.`).then(m => setTimeout(() => m.delete(), 3000));
    }

    // منع السب والدين والعنصرية
    if (bannedWords.some(word => content.includes(word))) {
        await message.delete().catch(() => {});
        return message.channel.send(`🚫 **|** يا ${message.author}، القوانين تمنع السب أو العنصرية في المدينة!`).then(m => setTimeout(() => m.delete(), 4000));
    }

    // منع التشفير (Spoiler)
    if (message.content.includes("||") && !message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        await message.delete().catch(() => {});
        return message.channel.send("⚠️ **|** يمنع استخدام التشفير لضمان شفافية الشات.").then(m => setTimeout(() => m.delete(), 3000));
    }

    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // --- [ 2. الأوامر ] ---

    // أمر المساعدة Help
    if (command === 'help' || command === 'اوامر') {
        const helpEmbed = new EmbedBuilder()
            .setTitle(`🌧️ مديـنة ${serverName} - دليل المواطن`)
            .setDescription(`مرحباً بك في مديـنة راين تاون، إليك الأوامر المتاحة لك:`)
            .addFields(
                { name: '📝 المواطنة', value: '`!verify [الاسم]` (للتفعيل الرسمي برمز [RT])\n`!x [تغريدة]` (نشر على منصة X)', inline: false },
                { name: '💰 الاقتصاد', value: '`!money` (رصيدك الحالي)\n`!shop` (عرض المتجر)', inline: false },
                { name: '🛡️ الإدارة', value: '`!ban`, `!mute`, `!give` (للمسؤولين فقط)', inline: false }
            )
            .setFooter({ text: `Developed by ${devName}` })
            .setColor("#000000"); 
        message.reply({ embeds: [helpEmbed] });
    }

    // أمر التفعيل Verify
    if (command === 'verify' || command === 'تفعيل') {
        const nick = args.join(" ");
        if (!nick) return message.reply("⚠️ **|** يرجى كتابة اسمك الثلاثي (مثل: محمد احمد العتيبي).");
        try {
            await message.member.setNickname(`[RT] ${nick}`);
            const verifyEmbed = new EmbedBuilder()
                .setTitle(`🌧️ ${serverName} - الهوية الوطنية`)
                .setDescription(`✅ **|** تم تفعيلك رسمياً يا **${nick}**\nنتمنى لك حياة سعيدة في راين تاون!`)
                .setFooter({ text: `Developed by ${devName}` })
                .setColor("#000000");
            message.reply({ embeds: [verifyEmbed] });
        } catch (e) { 
            message.reply("❌ **|** تأكد من رفع رتبة البوت لتغيير الأسماء."); 
        }
    }

    // منصة X (تغريدة)
    if (command === 'x' || command === 'تغريدة') {
        const tweet = args.join(" ");
        if (!tweet) return message.reply("⚠️ **|** ماذا تود أن تغرد؟");
        const xEmbed = new EmbedBuilder()
            .setAuthor({ name: `${message.member.displayName} @X`, iconURL: 'https://abs.twimg.com/icons/apple-touch-icon-192x192.png' })
            .setDescription(tweet)
            .setColor("#000000")
            .setTimestamp();
        message.channel.send({ embeds: [xEmbed] });
        message.delete().catch(() => {});
    }
});

// --- [ السحب من Railway Environment Variables ] ---
client.login(process.env.DISCORD_TOKEN);
