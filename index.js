const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, ActivityType } = require('discord.js');
const fs = require('fs');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers]
});

const prefix = "!";
const devName = "Wilked";

// قائمة الكلمات الممنوعة (سب، دين، عنصرية) - تقدر تزيد عليها
const bannedWords = ["كلب", "حمار", "يا كافر", "يا ملحد", "نيجا", "عبيد"]; 

client.on('ready', () => {
    console.log(`Old Town Bot is Online | Developed by ${devName}`);
    client.user.setActivity('Old Town RP 🏙️', { type: ActivityType.Competing });
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    // --- [ نظام الحماية والفلتر ] ---
    const content = message.content.toLowerCase();
    
    // 1. منع الإنجليزي (لو تبي السيرفر عربي فقط)
    const englishRegex = /[a-zA-Z]/;
    if (englishRegex.test(message.content) && !message.content.startsWith(prefix)) {
        await message.delete();
        return message.channel.send(`⚠️ ممنوع استخدام اللغة الإنجليزية في شات **Old Town**.`).then(m => setTimeout(() => m.delete(), 3000));
    }

    // 2. منع السب والعنصرية والدين
    if (bannedWords.some(word => content.includes(word))) {
        await message.delete();
        return message.channel.send(`🚫 يمنع السب أو التعدي على الدين والعنصرية! انتبه يا ${message.author}.`).then(m => setTimeout(() => m.delete(), 4000));
    }

    // 3. منع التشفير (الرموز الغريبة اللي تخفي الكلام)
    if (message.content.includes("||") && !message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        await message.delete();
        return message.channel.send("⚠️ يمنع استخدام التشفير في الشات العام.").then(m => setTimeout(() => m.delete(), 3000));
    }

    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // --- [ أمر المساعدة Help ] ---
    if (command === 'help' || command === 'اوامر') {
        const helpEmbed = new EmbedBuilder()
            .setTitle("🏙️ قائمة أوامر مديـنة Old Town")
            .setDescription("مرحباً بك في دليل خدمات المدينة الرسمي.")
            .addFields(
                { name: '🛠️ الإدارة', value: '`!ban`, `!mute`, `!give`, `!setup`', inline: false },
                { name: '💳 الاقتصاد', value: '`!money`, `!shop`, `!buy`', inline: false },
                { name: '📝 المواطنة', value: '`!verify [الاسم]`, `!x [تغريدة]`', inline: false },
                { name: '🛡️ الحماية', value: 'نظام آلي يمنع السب، العنصرية، التشفير، والإنجليزي.', inline: false }
            )
            .setFooter({ text: `Developed by ${devName}` })
            .setColor("#000000"); // اللون الأسود
        message.reply({ embeds: [helpEmbed] });
    }

    // --- [ أمر التفعيل ] ---
    if (command === 'verify' || command === 'تفعيل') {
        const nick = args.join(" ");
        if (!nick) return message.reply("⚠️ اكتب اسمك الثلاثي للتفعيل.");
        try {
            await message.member.setNickname(`[OT] ${nick}`);
            const verifyEmbed = new EmbedBuilder()
                .setTitle("✅ تم التفعيل بنجاح")
                .setDescription(`أهلاً بك يا **${nick}** في Old Town.`)
                .setFooter({ text: `Developed by ${devName}` })
                .setColor("#000000");
            message.reply({ embeds: [verifyEmbed] });
        } catch (e) { message.reply("❌ تأكد أن رتبة البوت أعلى من الجميع."); }
    }
    
    // (باقي الأوامر مثل البنك والمتجر تقدر تضيفها هنا بنفس الطريقة)
});

client.login(process.env.TOKEN);
