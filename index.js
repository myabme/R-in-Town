const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, ActivityType, REST, Routes, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers]
});

const devName = "Wilked";
const serverName = "Rain Town";

// قاعدة البيانات
let db = { users: {}, perms: {}, shop: { "car": 3000, "gun": 1500, "food": 50 } };
if (fs.existsSync('./database.json')) {
    db = JSON.parse(fs.readFileSync('./database.json', 'utf8'));
}
function saveDB() { fs.writeFileSync('./database.json', JSON.stringify(db, null, 4)); }

// --- [ تسجيل أوامر Slash ] ---
const commands = [
    new SlashCommandBuilder().setName('فلوسي').setDescription('عرض رصيدك الحالي في مديـنة راين تاون'),
    new SlashCommandBuilder().setName('تفعيل').setDescription('تفعيل هويتك وتغيير اسمك')
        .addStringOption(option => option.setName('الاسم').setDescription('اكتب اسمك الثلاثي').setRequired(true)),
    new SlashCommandBuilder().setName('متجر').setDescription('عرض قائمة المشتريات المتاحة'),
    new SlashCommandBuilder().setName('شراء').setDescription('شراء غرض من المتجر')
        .addStringOption(option => option.setName('الغرض').setDescription('اختر ما تريد شراءه').setRequired(true)
            .addChoices({ name: 'سيارة', value: 'car' }, { name: 'سلاح', value: 'gun' }, { name: 'وجبة', value: 'food' })),
    new SlashCommandBuilder().setName('خاصيات').setDescription('تحديد رتبة مسموح لها باستخدام البوت (للأدمن)')
        .addRoleOption(option => option.setName('الرتبة').setDescription('الرتبة المراد تعديلها').setRequired(true))
        .addStringOption(option => option.setName('الحالة').setDescription('السماح أو المنع').setRequired(true)
            .addChoices({ name: 'سماح', value: 'allow' }, { name: 'منع', value: 'deny' })),
    new SlashCommandBuilder().setName('help').setDescription('عرض قائمة أوامر مديـنة Rain Town')
].map(command => command.toJSON());

client.on('ready', async () => {
    console.log(`${serverName} Bot is Online | Developed by ${devName}`);
    client.user.setActivity(`${serverName} RP 🌧️`, { type: ActivityType.Competing });

    // تسجيل الأوامر في ديسكورد
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    try {
        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
        console.log('Successfully registered slash commands!');
    } catch (error) { console.error(error); }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName, options, user, member } = interaction;
    const userId = user.id;

    // تصفير الحساب للجدد (5000 ريال)
    if (!db.users[userId]) {
        db.users[userId] = { money: 5000, items: [] };
        saveDB();
    }

    // --- [ تنفيذ الأوامر ] ---

    if (commandName === 'فلوسي') {
        const moneyEmbed = new EmbedBuilder()
            .setTitle(`💰 محفظة مديـنة ${serverName}`)
            .setDescription(`رصيدك الحالي: **${db.users[userId].money} ريال**`)
            .setFooter({ text: `Developed by ${devName}` }).setColor("#000000");
        await interaction.reply({ embeds: [moneyEmbed] });
    }

    if (commandName === 'تفعيل') {
        const nick = options.getString('الاسم');
        await member.setNickname(`[RT] ${nick}`).catch(() => {});
        const verifyEmbed = new EmbedBuilder()
            .setTitle(`🌧️ مديـنة ${serverName}`)
            .setDescription(`✅ تم تفعيلك بنجاح يا **${nick}**`)
            .setFooter({ text: `Developed by ${devName}` }).setColor("#000000");
        await interaction.reply({ embeds: [verifyEmbed] });
    }

    if (commandName === 'متجر') {
        const shopEmbed = new EmbedBuilder()
            .setTitle(`🛒 متجر ${serverName}`)
            .addFields(
                { name: '🚗 سيارة', value: '3000 ريال', inline: true },
                { name: '🔫 سلاح', value: '1500 ريال', inline: true },
                { name: '🍔 وجبة', value: '50 ريال', inline: true }
            ).setFooter({ text: `Developed by ${devName}` }).setColor("#000000");
        await interaction.reply({ embeds: [shopEmbed] });
    }

    if (commandName === 'شراء') {
        const itemKey = options.getString('الغرض');
        const price = db.shop[itemKey];
        if (db.users[userId].money < price) return interaction.reply({ content: "❌ رصيدك لا يكفي!", ephemeral: true });

        db.users[userId].money -= price;
        saveDB();
        await interaction.reply({ content: `✅ مبروك! اشتريت الغرض بنجاح وخصمنا ${price} ريال.` });
    }

    if (commandName === 'help') {
        const helpEmbed = new EmbedBuilder()
            .setTitle(`🌧️ أوامر ${serverName}`)
            .setDescription("استخدم `/` لعرض الأوامر وتجربتها.\n\nDeveloped by **Wilked**")
            .setColor("#000000");
        await interaction.reply({ embeds: [helpEmbed] });
    }
});

client.login(process.env.DISCORD_TOKEN);
