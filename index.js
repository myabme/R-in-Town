const { Client, GatewayIntentBits, ActivityType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
const fs = require('fs'); // مكتبة النظام لقراءة وحفظ الملفات

const bot = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] 
});

const BLACK = 0x000000;
const FOOTER = "developed by wilked";
const DATA_FILE = './rain_town_data.json'; // ملف الحفظ التلقائي

// --- نظام تحميل البيانات عند التشغيل ---
let db = { players: {}, permissions: { police: "شرطة", admin: "إدارة", gang: "عصابة" }, adminPoints: {} };

if (fs.existsSync(DATA_FILE)) {
    db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

// وظيفة الحفظ التلقائي
function saveData() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 4));
}

bot.once('ready', () => {
    bot.user.setPresence({
        activities: [{ name: 'Rain Town V5 | Auto-Save Active', type: ActivityType.Streaming, url: 'https://twitch.tv/wilked' }],
        status: 'online',
    });
    console.log("**__[نظام الحفظ التلقائي لـ رين تاون يعمل بنجاح]__**");
});

bot.on('messageCreate', async message => {
    if (message.author.bot || !message.content.startsWith('!')) return;
    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // التأكد من وجود بيانات للاعب
    if (!db.players[message.author.id]) {
        db.players[message.author.id] = { money: 5000, bank: 10000, inventory: [], job: "مواطن" };
        saveData();
    }

    // --- 1. نظام الرتب والتحكم (محفوظ) ---
    if (command === 'رتب') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
        const type = args[0];
        const newRole = args.slice(1).join(" ");
        if (db.permissions[type] !== undefined) {
            db.permissions[type] = newRole;
            saveData(); // حفظ التعديل فوراً
            message.reply(`**__[✅] تم تحديث رتبة {${type}} إلى {${newRole}}.. محفوظ بنجاح!__**`);
        }
    }

    // --- 2. نظام البنك (محفوظ ومستقر) ---
    if (command === 'بنك') {
        const p = db.players[message.author.id];
        const embed = new EmbedBuilder()
            .setTitle("🏦 بنك رين تاون المركزي")
            .addFields(
                { name: "💰 كاش", value: `${p.money}$`, inline: true },
                { name: "💳 البنك", value: `${p.bank}$`, inline: true }
            )
            .setColor(BLACK).setFooter({ text: FOOTER });
        message.channel.send({ embeds: [embed] });
    }

    // --- 3. نظام نقاط الإدارة (محفوظ) ---
    if (command === 'نقطة') {
        if (!message.member.roles.cache.some(r => r.name === db.permissions.admin)) return;
        const target = message.mentions.users.first();
        if (!target) return message.reply("**__منشن الإداري!__**");
        
        db.adminPoints[target.id] = (db.adminPoints[target.id] || 0) + 1;
        saveData();
        message.reply(`**__[🎖️] تم منح نقطة لـ {${target.username}}.. المجموع الحالي: ${db.adminPoints[target.id]}__**`);
    }

    // --- 4. نظام Say و DM (أوامر تنفيذية) ---
    if (command === 'say') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return;
        const mode = args[0];
        const text = args.slice(1).join(" ");
        if (mode === 'ايمبد') {
            const embed = new EmbedBuilder().setDescription(`**__${text}__**`).setColor(BLACK).setFooter({ text: FOOTER });
            message.channel.send({ embeds: [embed] });
        } else {
            message.channel.send(text);
        }
        message.delete().catch(() => {});
    }

    if (command === 'dm') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
        const target = message.mentions.members.first() || message.mentions.roles.first();
        const msg = args.slice(1).join(" ");
        if (target.user) {
            target.send(`**__[✉️] رسالة إدارية:\n\n${msg}__**`).catch(() => {});
            message.reply(`**__[✅] تم الإرسال لـ {${target.user.username}}__**`);
        } else {
            target.members.forEach(m => m.send(`**__[📢] تنبيه للرتبة:\n\n${msg}__**`).catch(() => {}));
            message.reply(`**__[✅] تم الإرسال للرتبة كاملة__**`);
        }
    }
});

// --- نظام الأزرار (Buttons) ---
bot.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    let list = "";
    if (interaction.customId === 'cat_admin') list = "`!رتب` `!نقطة` `!say` `!dm` `!سجن`";
    if (interaction.customId === 'cat_bank') list = "`!بنك` `!تحويل` `!سحب` `!راتب`";
    
    await interaction.reply({ content: `📜 **أوامر القسم:**\n${list}`, ephemeral: true });
});

bot.login(process.env.DISCORD_TOKEN);
