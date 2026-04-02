const { Client, GatewayIntentBits, ActivityType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
const fs = require('fs');

const bot = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent, 
        GatewayIntentBits.GuildMembers
    ] 
});

const BLACK = 0x000000;
const FOOTER = "developed by wilked";
const PREFIX = "!";
const DATA_FILE = './data.json';

// --- نظام قاعدة البيانات ---
let db = { players: {}, permissions: { police: "شرطة", admin: "إدارة" }, adminPoints: {} };

function loadData() {
    if (fs.existsSync(DATA_FILE)) {
        try {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            db = JSON.parse(data);
        } catch (e) { console.log("خطأ في قراءة الملف، سيتم البدء من جديد."); }
    }
}
function saveData() { fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 4)); }

bot.once('ready', () => {
    loadData();
    bot.user.setPresence({ activities: [{ name: 'Rain Town | Fixed & Ready', type: ActivityType.Streaming, url: 'https://twitch.tv/wilked' }] });
    console.log("✅ البوت شغال والبيانات محملة!");
});

bot.on('messageCreate', async message => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // تجهيز بيانات اللاعب تلقائياً
    if (!db.players[message.author.id]) {
        db.players[message.author.id] = { money: 5000, bank: 10000 };
        saveData();
    }

    // --- [ أمر الهيلب المصلح ] ---
    if (command === 'help' || command === 'اوامر') {
        const embed = new EmbedBuilder()
            .setTitle("👑 أوامر Rain Town")
            .setDescription("**__اضغط على الأزرار لتظهر لك الأوامر في رسالة خاصة مؤقتة:__**")
            .setColor(BLACK).setFooter({ text: FOOTER });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('h_adm').setLabel('🛡️ الإدارة').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('h_eco').setLabel('💰 الاقتصاد').setStyle(ButtonStyle.Secondary)
        );
        return message.channel.send({ embeds: [embed], components: [row] });
    }

    // --- [ أوامر الإدارة ] ---
    if (command === 'رتب') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
        const type = args[0];
        const name = args.slice(1).join(" ");
        if (db.permissions[type] !== undefined && name) {
            db.permissions[type] = name;
            saveData();
            return message.reply(`✅ تم تحديث رتبة **${type}** إلى **${name}**`);
        }
        return message.reply("!رتب [police/admin] [الاسم]");
    }

    if (command === 'say') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return;
        const text = args.join(" ");
        if (!text) return;
        const embed = new EmbedBuilder().setDescription(`**__${text}__**`).setColor(BLACK).setFooter({ text: FOOTER });
        message.delete().catch(() => {});
        return message.channel.send({ embeds: [embed] });
    }
});

// --- [ مصلح التفاعلات - Interaction Handler ] ---
bot.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    let text = "";
    if (interaction.customId === 'h_adm') text = "🛡️ **أوامر الإدارة:**\n`!رتب` `!نقطة` `!say` `!dm` `!سجن`";
    if (interaction.customId === 'h_eco') text = "💰 **أوامر الاقتصاد:**\n`!بنك` `!تحويل` `!راتب` `!سحب`";

    return interaction.reply({ content: text, ephemeral: true }).catch(() => {});
});

bot.login(process.env.DISCORD_TOKEN);
