const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ActivityType, PermissionsBitField } = require('discord.js');
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
const devSignature = "Developed by Wilked (Rain Town) 🌧️";

// تحميل قاعدة البيانات بأمان
let db = { users: {}, perms: {}, customCommands: {}, cmdAliases: {} };
try {
    if (fs.existsSync('./database.json')) {
        const data = fs.readFileSync('./database.json', 'utf8');
        db = JSON.parse(data);
    }
} catch (e) { console.log("Database initialized."); }

function saveDB() {
    fs.writeFileSync('./database.json', JSON.stringify(db, null, 4));
}

client.on('ready', () => {
    console.log(`Rain Town is Back! | ${devSignature}`);
    client.user.setActivity(`Rain Town RP | !help`, { type: ActivityType.Watching });
});

client.on('messageCreate', async message => {
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const rawCommand = args.shift().toLowerCase();

    // فحص الأسماء المستعارة (Aliases)
    const command = db.cmdAliases && db.cmdAliases[rawCommand] ? db.cmdAliases[rawCommand] : rawCommand;

    // --- [ 1. نظام تعديل الأوامر ] ---
    if (command === 'تعديل') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
        const type = args[0]; // (اسم أو اضافة)
        
        if (type === 'اسم') {
            const oldName = args[1];
            const newName = args[2];
            if (!oldName || !newName) return message.reply("⚠️ !تعديل اسم [القديم] [الجديد]");
            if (!db.cmdAliases) db.cmdAliases = {};
            db.cmdAliases[newName] = oldName;
            saveDB();
            return message.reply(`✅ تم تغيير اسم الأمر من **${oldName}** إلى **${newName}**.`);
        }
        if (type === 'اضافة') {
            const cmdName = args[1];
            const response = args.slice(2).join(" ");
            if (!cmdName || !response) return message.reply("⚠️ !تعديل اضافة [الامر] [الرد]");
            if (!db.customCommands) db.customCommands = {};
            db.customCommands[cmdName] = response;
            saveDB();
            return message.reply(`✅ تم إضافة أمر جديد: **${cmdName}**.`);
        }
    }

    // تشغيل الأوامر المضافة
    if (db.customCommands && db.customCommands[command]) {
        return message.reply(db.customCommands[command]);
    }

    // --- [ 2. أوامر المساعدة (Help) ] ---
    if (command === 'help' || command === 'اوامر') {
        const helpEmbed = new EmbedBuilder()
            .setTitle(`🌧️ مديـنة Rain Town - دليل المساعدة`)
            .setDescription(`مرحباً بك، اختر القسم المطلوب من القائمة بالأسفل.\n\n**ملاحظة للأدمن:** لتغيير اسم أمر استخدم \`!تعديل اسم [القديم] [الجديد]\``)
            .setColor("#000000")
            .setFooter({ text: devSignature });

        const menu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('help_select')
                .setPlaceholder('اختر القسم...')
                .addOptions([
                    { label: '💰 المتجر والتصنيع', value: 'shop_p', emoji: '🛒' },
                    { label: '🪪 الهوية والتفعيل', value: 'verify_p', emoji: '📝' },
                    { label: '⚙️ أوامر السيرفر', value: 'server_p', emoji: '🏙️' }
                ])
        );
        return message.reply({ embeds: [helpEmbed], components: [menu] });
    }

    // --- [ 3. أمر التفعيل ] ---
    if (command === 'تفعيل') {
        const target = message.mentions.members.first();
        const nick = args.slice(1).join(" ");
        if (!target || !nick) return message.reply("⚠️ !تفعيل @الشخص الاسم");
        
        try {
            await target.setNickname(`[RT] ${nick}`);
            message.reply(`✅ تم تفعيل المواطن **${nick}** بنجاح.`);
        } catch (e) { message.reply("❌ البوت يحتاج رتبة أعلى لتغيير الأسماء."); }
    }

    // --- [ 4. أوامر الاقتصاد ] ---
    if (command === 'فلوسي') {
        const userId = message.author.id;
        if (!db.users[userId]) db.users[userId] = { money: 5000 };
        message.reply(`💵 رصيدك الحالي: **${db.users[userId].money}$**`);
    }
});

// معالجة القائمة (Help Menu)
client.on('interactionCreate', async interaction => {
    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId === 'help_select') {
        const embed = new EmbedBuilder().setColor("#000000").setFooter({ text: devSignature });
        
        if (interaction.values[0] === 'shop_p') {
            embed.setTitle("🛒 أوامر المتجر").setDescription("`!متجر_اسلحة` | `!معرض_سيارات` | `!تجميع` | `!تصنع_سلاح`").setImage("https://i.ibb.co/pLgR9Dq/weapons-shop.jpg");
        } else if (interaction.values[0] === 'verify_p') {
            embed.setTitle("🪪 أوامر الهوية").setDescription("`!تفعيل @الشخص الاسم` | `!هوية` | `!حقيبتي`").setImage("https://i.ibb.co/KjqY0wN/id-card.png");
        } else if (interaction.values[0] === 'server_p') {
            embed.setTitle("🏙️ أوامر السيرفر").setDescription("`!فلوسي` | `!خاصيات` | `!تعديل اسم` | `!بلاغ`").setImage("https://i.ibb.co/L5hY5Mh/car-dealer.jpg");
        }
        await interaction.update({ embeds: [embed] });
    }
});

client.login(process.env.DISCORD_TOKEN);
