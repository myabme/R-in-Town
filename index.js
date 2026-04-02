const { Client, GatewayIntentBits, ActivityType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

const bot = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent, 
        GatewayIntentBits.GuildMembers
    ] 
});

// --- قاعدة البيانات المؤقتة وفلاتر الحماية ---
let players = {}; 
const craftingCooldowns = new Set();
const BANNED_WORDS = ["سب", "عنصرية", "دين"]; 
const BANNED_LEGENDS = ["ماثيو", "كافح", "المكافح", "راكان", "جسار", "عقاب", "صخر", "شيبان", "هتلر", "ديربي", "عقيل", "جبر"];
const BLACK_COLOR = 0x000000;
const PREFIX = '!';

// --- قائمة المسدسات المتاحة للتصنيع (قراند سوني) ---
const pistols = [
    { name: "Pistol (العادي)", material: "15 حديد", ms: 30000 },
    { name: "Combat Pistol (القتالي)", material: "25 حديد", ms: 60000 },
    { name: "Heavy Pistol (الثقيل)", material: "40 حديد", ms: 120000 },
    { name: "Vintage Pistol (الكلاسيكي)", material: "20 حديد", ms: 45000 }
];

bot.once('ready', () => {
    bot.user.setPresence({
        activities: [{ name: 'Rain Town RP | Dev By Wilked', type: ActivityType.Streaming, url: 'https://www.twitch.tv/wilked' }],
        status: 'online',
    });
    console.log("**__[نظام رين تاون الشامل والآمن جاهز للعمل]__**");
});

bot.on('messageCreate', async message => {
    if (message.author.bot) return;

    // --- 1. نظام الحماية التلقائي من السب ---
    if (BANNED_WORDS.some(word => message.content.includes(word))) {
        await message.delete().catch(() => {});
        return message.channel.send(`**__عـذراً {${message.author.username}}، يـمـنـع الـتـجـاوز فـي مـديـنـتـنـا__**`).then(m => setTimeout(() => m.delete(), 3000));
    }

    if (!message.content.startsWith(PREFIX)) return;
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // --- 2. نظام إنشاء الهوية (مع منع التكرار والأساطير) ---
    if (command === 'انشاء_هوية') {
        const name = args[0];
        const age = parseInt(args[1]);
        if (!name || isNaN(age)) return message.reply("**__يـرجى كـتـابة: `!انشاء_هوية [الاسم] [العمر]`__**");
        
        if (BANNED_LEGENDS.some(legend => name.includes(legend))) return message.reply("**__الاسـم مـمـنـوع (مـن أسـاطـيـر الـ RP)__**");
        if (age < 20 || age > 45) return message.reply("**__يـجـب أن يـكـون الـعـمر مـا بـين 20 و 45 عـامـاً__**");

        players[message.author.id] = { name, age, money: 5000, bank: 10000, inventory: ["جوال", "رخصة"] };
        const embed = new EmbedBuilder().setTitle("🆔 هـويـة ريـن تـاون").setDescription(`**__تـم إصـدار هـويـتـك الـرسمية بـنـجـاح__**\n\n**__الاسـم: ${name}__**\n**__الـعـمـر: ${age}__**\n**__الـرصـيد: 5000$__**`).setColor(BLACK_COLOR).setFooter({ text: 'developed by wilked' });
        message.channel.send({ embeds: [embed] });
    }

    // --- 3. نظام الحقيبة ---
    if (command === 'حقيبة') {
        const p = players[message.author.id];
        if (!p) return message.reply("**__لـيـس لـديـك هـويـة بـعـد__**");
        const embed = new EmbedBuilder().setTitle("🎒 حـقـيـبـة الـمـواطـن").setDescription(`**__مـحـتـويـاتـك:__**\n**__${p.inventory.join(" - ")}__**`).setColor(BLACK_COLOR);
        message.channel.send({ embeds: [embed] });
    }

    // --- 4. نظام البنك والمحفظة ---
    if (command === 'بنك') {
        const p = players[message.author.id] || { money: 0, bank: 0 };
        const embed = new EmbedBuilder().setTitle("🏦 ريـن بـانـك | Rain Bank").addFields({ name: "💰 الـمحفظة", value: `**__${p.money}$__**`, inline: true }, { name: "💳 الـحـساب", value: `**__${p.bank}$__**`, inline: true }).setColor(BLACK_COLOR).setFooter({ text: 'developed by wilked' });
        message.channel.send({ embeds: [embed] });
    }

    // --- 5. نظام التصنيع (المسدسات فقط بالوقت) ---
    if (command === 'تصنيع') {
        const embed = new EmbedBuilder().setTitle("🛠️ ورشـة الـتـصـنـيـع الـحـربي").setDescription("**__الأسـلـحـة الـمـتـاحـة لـلـتـصـنـيـع الآن (المسدسات):__**").setColor(BLACK_COLOR);
        pistols.forEach(p => embed.addFields({ name: `🔫 ${p.name}`, value: `**__المتطلبات: ${p.material} | الوقت: ${p.ms/1000} ثانية__**` }));
        embed.setFooter({ text: 'للبدء اكتب: !اصنع [اسم المسدس]' });
        message.channel.send({ embeds: [embed] });
    }

    if (command === 'اصنع') {
        if (craftingCooldowns.has(message.author.id)) return message.reply("**__عـذراً، عـمـلـيـة تـصـنـيـع أخـرى قـيـد الـتـنـفـيـذ__**");
        const weaponName = args.join(" ");
        const weapon = pistols.find(p => weaponName && p.name.toLowerCase().includes(weaponName.toLowerCase()));
        if (!weapon) return message.reply("**__هـذا الـسـلاح غـيـر مـتـوفـر__**");

        craftingCooldowns.add(message.author.id);
        message.channel.send(`**__🛠️ جـارٍ تـصـنـيـع {${weapon.name}}.. يـرجـى الانـتـظـار..__**`);

        setTimeout(() => {
            craftingCooldowns.delete(message.author.id);
            if (players[message.author.id]) players[message.author.id].inventory.push(weapon.name);
            const success = new EmbedBuilder().setTitle("✅ تـم الـتـصـنـيـع").setDescription(`**__أُضـيـف {${weapon.name}} إلـى حـقـيـبـتـك__**`).setColor(BLACK_COLOR).setFooter({ text: 'developed by wilked' });
            message.channel.send({ content: `${message.author}`, embeds: [success] });
        }, weapon.ms);
    }

    // --- 6. نظام منصة X (الجوال) ---
    if (command === 'اكس') {
        const tweet = args.join(" ");
        if (!tweet) return;
        const embed = new EmbedBuilder().setTitle("🐦 مـنـصـة X | Rain Town").setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() }).setDescription(`**__${tweet}__**`).setColor(BLACK_COLOR).setFooter({ text: 'تـم الإرسـال عـبـر الـجـوال' });
        message.channel.send({ embeds: [embed] });
        message.delete();
    }

    // --- 7. أمر المساعدة (Help) ---
    if (command === 'help') {
        const embed = new EmbedBuilder().setTitle("📜 دليـل نـظـام Rain Town").setColor(BLACK_COLOR)
            .addFields(
                { name: "🆔 الـهوية", value: "`!انشاء_هوية` , `!حقيبة`" },
                { name: "🏦 الـمـال", value: "`!بنك` , `!متجر`" },
                { name: "🛠️ الـتـقـني", value: "`!تصنيع` , `!اصنع` , `!اكس`" },
                { name: "🛡️ الإدارة", value: "`!say` , `!طرد` , `!رتبة`" }
            ).setFooter({ text: 'developed by wilked' });
        message.channel.send({ embeds: [embed] });
    }

    // --- 8. أوامر الإدارة (!say) ---
    if (command === 'say') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
        const msg = args.join(" ");
        if (!msg) return;
        const embed = new EmbedBuilder().setDescription(`**__{${msg}}__**`).setColor(BLACK_COLOR).setFooter({ text: 'developed by wilked' });
        message.channel.send({ embeds: [embed] });
        message.delete();
    }
});

// --- التوكن الآمن ---
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
if (DISCORD_TOKEN) { bot.login(DISCORD_TOKEN); } 
else { console.log("❌ التوكن غير موجود في Secrets!"); }
