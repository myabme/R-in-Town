const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ActivityType } = require('discord.js');
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

client.on('ready', () => {
    console.log(`Rain Town Help System | ${devSignature}`);
    client.user.setActivity(`Rain Town RP | !help`, { type: ActivityType.Watching });
});

client.on('messageCreate', async message => {
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'help' || command === 'اوامر') {
        const mainEmbed = new EmbedBuilder()
            .setTitle("🌧️ مركز مساعدة مديـنة Rain Town")
            .setDescription("مرحباً بك يا مواطن، يرجى اختيار القسم من القائمة بالأسفل لعرض الأوامر الخاصة به.")
            .setColor("#000000")
            .setFooter({ text: devSignature });

        const menu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('help_menu')
                    .setPlaceholder('اختر القسم المطلوب...')
                    .addOptions([
                        {
                            label: '🛒 أوامر المتجر والتصنيع',
                            description: 'عرض أوامر البيع والشراء والطبخ',
                            value: 'shop_cmds',
                            emoji: '💰'
                        },
                        {
                            label: '📝 أوامر التفعيل والمواطنة',
                            description: 'عرض أوامر الهوية والتفعيل ومنصة X',
                            value: 'verify_cmds',
                            emoji: '🪪'
                        },
                        {
                            label: '⚙️ أوامر السيرفر العامة',
                            description: 'عرض أوامر البنك والمساعدة والخاصيات',
                            value: 'server_cmds',
                            emoji: '🏙️'
                        }
                    ]),
            );

        await message.reply({ embeds: [mainEmbed], components: [menu] });
    }
});

// --- [ معالجة اختيار القائمة ] ---
client.on('interactionCreate', async interaction => {
    if (!interaction.isStringSelectMenu()) return;

    if (interaction.customId === 'help_menu') {
        let embed = new EmbedBuilder().setColor("#000000").setFooter({ text: devSignature });

        if (interaction.values[0] === 'shop_cmds') {
            embed.setTitle("💰 قائمة أوامر المتجر والتصنيع")
                .addFields(
                    { name: '🛒 التجارة:', value: '`!متجر_اسلحة` | `!معرض_سيارات` | `!شراء [اسم]`', inline: false },
                    { name: '🛠️ التصنيع:', value: '`!تجميع` | `!تصنع_سلاح` | `!طبخ_ممنوعات`', inline: false }
                )
                .setImage("https://i.ibb.co/pLgR9Dq/weapons-shop.jpg");
        } 
        
        else if (interaction.values[0] === 'verify_cmds') {
            embed.setTitle("🪪 قائمة أوامر التفعيل والمواطنة")
                .addFields(
                    { name: '📝 التفعيل:', value: '`!تفعيل @الشخص الاسم` (للإدارة)', inline: false },
                    { name: '👤 الشخصية:', value: '`!هوية` | `!حقيبتي` | `!لفلي`', inline: false },
                    { name: '📱 الجوال:', value: '`!تغريدة [نص]` | `!x [نص]`', inline: false }
                )
                .setImage("https://i.ibb.co/KjqY0wN/id-card.png");
        }

        else if (interaction.values[0] === 'server_cmds') {
            embed.setTitle("🏙️ أوامر السيرفر العامة")
                .addFields(
                    { name: '🏦 المالية:', value: '`!فلوسي` | `!تحويل @الشخص [المبلغ]` | `!تزويد`', inline: false },
                    { name: '⚖️ الإدارة:', value: '`!خاصيات @رتبة allow/deny` | `!رسبكت @الشخص [+/-]`', inline: false },
                    { name: '🚨 الطوارئ:', value: '`!بلاغ [نص]` | `!اسعاف` | `!موقع`', inline: false }
                )
                .setImage("https://i.ibb.co/L5hY5Mh/car-dealer.jpg");
        }

        await interaction.update({ embeds: [embed] });
    }
});

client.login(process.env.DISCORD_TOKEN);
