const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ActivityType } = require('discord.js');
const fs = require('fs');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers]
});

const prefix = "!";
const devSignature = "Developed by Wilked (Rain Town) 🌧️";

// تحميل قاعدة البيانات (تخزين الأوامر المعدلة والجديدة)
let db = { users: {}, perms: {}, customCommands: {}, cmdAliases: {} };
if (fs.existsSync('./database.json')) {
    db = JSON.parse(fs.readFileSync('./database.json', 'utf8'));
}
function saveDB() { fs.writeFileSync('./database.json', JSON.stringify(db, null, 4)); }

client.on('ready', () => {
    console.log(`Rain Town Command Manager | ${devSignature}`);
});

client.on('messageCreate', async message => {
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const rawCommand = args.shift().toLowerCase();

    // فحص إذا كان الأمر له "اسم مستعار" (Alias) تم تعديله من الديسكورد
    const command = db.cmdAliases[rawCommand] || rawCommand;

    // --- [ نظام تعديل الأوامر من الديسكورد - للأدمن فقط ] ---
    if (command === 'تعديل_امر') {
        if (!message.member.permissions.has('Administrator')) return;
        
        const type = args[0]; // (alias أو add)
        if (type === 'اسم') {
            // مثال: !تعديل_امر اسم [الاسم_القديم] [الاسم_الجديد]
            const oldName = args[1];
            const newName = args[2];
            if (!oldName || !newName) return message.reply("⚠️ الاستخدام: `!تعديل_امر اسم [القديم] [الجديد]`");
            
            db.cmdAliases[newName] = oldName;
            saveDB();
            message.reply(`✅ تم تغيير اسم الأمر من **${oldName}** إلى **${newName}** بنجاح!`);
        } 
        else if (type === 'اضافة') {
            // مثال: !تعديل_امر اضافة [الامر] [الرد]
            const cmdName = args[1];
            const response = args.slice(2).join(" ");
            if (!cmdName || !response) return message.reply("⚠️ الاستخدام: `!تعديل_امر اضافة [الامر] [الرد]`");
            
            db.customCommands[cmdName] = response;
            saveDB();
            message.reply(`✅ تم إضافة أمر جديد باسم **${cmdName}** بنجاح!`);
        }
    }

    // --- [ تشغيل الأوامر المضافة (Custom Commands) ] ---
    if (db.customCommands[command]) {
        return message.reply(db.customCommands[command]);
    }

    // --- [ الأوامر الأساسية (بعد فحص الاسم المستعار) ] ---
    if (command === 'help' || command === 'اوامر') {
        const helpEmbed = new EmbedBuilder()
            .setTitle(`🏙️ لوحة تحكم أوامر ${devSignature}`)
            .setDescription("اختر القسم لعرض الأوامر، أو استخدم `!تعديل_امر` لتغيير المسميات.")
            .setColor("#000000")
            .setFooter({ text: devSignature });

        const menu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('help_menu')
                .setPlaceholder('اختر القسم...')
                .addOptions([
                    { label: '🛒 المتجر', value: 'shop', emoji: '💰' },
                    { label: '📝 المواطنة', value: 'verify', emoji: '🪪' },
                    { label: '⚙️ الإعدادات', value: 'settings', emoji: '🛠️' }
                ])
        );
        message.reply({ embeds: [helpEmbed], components: [menu] });
    }

    // مثال لأمر التفعيل (بيشتغل بالاسم القديم أو الجديد اللي اخترته)
    if (command === 'تفعيل') {
        const target = message.mentions.members.first();
        const nick = args.slice(1).join(" ");
        if (!target || !nick) return message.reply("⚠️ !تفعيل @الشخص الاسم");
        await target.setNickname(`[RT] ${nick}`).catch(() => {});
        message.reply(`✅ تم تفعيل المواطن بنجاح.`);
    }
});

client.login(process.env.DISCORD_TOKEN);
