import discord
from discord.ext import commands
from discord.ui import Select, View, Button

# --- الإعدادات الأساسية ---
intents = discord.Intents.all()
bot = commands.Bot(command_prefix='!', intents=intents, help_command=None)

# --- قاعدة البيانات والفلترة ---
players = {} 
BANNED_LEGENDS = ["ماثيو", "كافح", "المكافح", "راكان", "جسار", "عقاب", "صخر", "شيبان", "هتلر", "ديربي", "عقيل", "جبر"]
BLACK_COLOR = 0x000000 # اللون الأسود الملكي

# --- حالة البث (Streaming) ---
@bot.event
async def on_ready():
    activity = discord.Streaming(
        name="Rain Town RP | Dev By Wilked", 
        url="https://www.twitch.tv/wilked"
    )
    await bot.change_presence(activity=activity)
    print(f"**__[تم تشغيل نظام رين تاون الأسود بنجاح]__**")

# --- 1. نظام البنك (إيمبد أسود + قائمة منسدلة) ---
class BankOptions(Select):
    def __init__(self):
        options = [
            discord.SelectOption(label="فـلـوسـي | My Balance", emoji="💰"),
            discord.SelectOption(label="تـحـويـل | Transfer", emoji="💸"),
            discord.SelectOption(label="إيـداع | Deposit", emoji="🏦"),
        ]
        super().__init__(placeholder="اختر العملية البنكية المطلوبة...", options=options)

    async def callback(self, interaction: discord.Interaction):
        # الردود تظهر فقط للمستخدم (Ephemeral) لتجنب تخريب الروم
        if "فـلـوسـي" in self.values[0]:
            await interaction.response.send_message("**__رصـيـدك الـحـالـي هـو: 5000$ | Your Balance is: 5000$__**", ephemeral=True)
        elif "تـحـويـل" in self.values[0]:
            await interaction.response.send_message("**__لإتـمام عـمـلـيـة الـتـحـويـل، يـرجـى اسـتـخدام الأمـر: `!حوالة [الشخص] [المبلغ]`__**", ephemeral=True)
        elif "إيـداع" in self.values[0]:
            await interaction.response.send_message("**__نـظـام الإيـداع الـتـلـقـائـي يـعـمل حـالـياً عـبـر الـصـرافات الـمـنـتـشرة__**", ephemeral=True)

class BankView(View):
    def __init__(self):
        super().__init__(timeout=None)
        self.add_item(BankOptions())

# --- 2. نظام إنشاء الشخصية (فلترة + أسود) ---
@bot.command(name="انشاء_شخصية")
async def create_id(ctx, name: str, age: int):
    user_name = name.strip()
    if any(legend in user_name for legend in BANNED_LEGENDS):
        embed = discord.Embed(title="❌ رَفـض الـتـسـجـيـل", description="**__عـذراً، هـذا الاسـم مـمـنـوع لـديـنـا__**", color=BLACK_COLOR)
        return await ctx.send(embed=embed)

    for p_id in players:
        if players[p_id].get('identity') and players[p_id]['identity']['name'] == user_name:
            embed = discord.Embed(title="❌ رَفـض الـتـسـجـيـل", description="**__عـذراً، هـذا الاسـم مـتـكـرر ولا يـمـكـن مـنـحه لـك__**", color=BLACK_COLOR)
            return await ctx.send(embed=embed)

    if not (20 <= age <= 45):
        return await ctx.send("**__يـجـب أن يـكـون الـعـمر مـا بـين 20 و 45 عـامـاً__**")

    players[ctx.author.id] = {"money": 5000, "identity": {"name": user_name, "age": age}}
    embed = discord.Embed(title="🆔 هـويـة Rain Town", description=f"**__تـم تـسـجـيـل بـيـانـاتـك الـرسـمـيـة بـنـجـاح__**\n\n**__الاسـم: {user_name}__**\n**__الـعـمر: {age}__**\n**__الـرصـيد: 5000$__**", color=BLACK_COLOR)
    embed.set_footer(text="developed by wilked")
    await ctx.send(embed=embed)

# --- 3. نظام التحدث (!say) بـ أزرار ---
class SayView(View):
    def __init__(self, content):
        super().__init__(timeout=30)
        self.content = content

    @discord.ui.button(label="إرسال رسالة عادية", style=discord.ButtonStyle.secondary, emoji="💬")
    async def send_normal(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.channel.send(self.content)
        await interaction.response.edit_message(content="**__تم الإرسال بنجاح__**", view=None)

    @discord.ui.button(label="إرسال إيمبد أسود", style=discord.ButtonStyle.primary, emoji="🖼️")
    async def send_embed(self, interaction: discord.Interaction, button: discord.ui.Button):
        embed = discord.Embed(description=f"**__{self.content}__**", color=BLACK_COLOR)
        embed.set_footer(text="developed by wilked")
        await interaction.channel.send(embed=embed)
        await interaction.response.edit_message(content="**__تم إرسال الإيمبد بنجاح__**", view=None)

@bot.command(name="say")
@commands.has_permissions(administrator=True)
async def say(ctx, *, message: str):
    view = SayView(message)
    await ctx.send("**__اختر طريقة الإرسال المناسبة:__**", view=view, ephemeral=True)
    await ctx.message.delete()

# --- 4. نظام الرسائل الخاصة (!dm) إيمبد أسود ---
@bot.command(name="dm")
@commands.has_permissions(administrator=True)
async def dm(ctx, target: discord.abc.SnowflakeEntity, *, message: str):
    embed = discord.Embed(title="📩 رسالة رسمية من إدارة Rain Town", description=f"**__{message}__**", color=BLACK_COLOR)
    embed.set_footer(text="developed by wilked")

    if isinstance(target, discord.Role):
        for member in target.members:
            try: await member.send(embed=embed)
            except: continue
        await ctx.send(f"**__تم الإرسال لجميع أعضاء رتبة {target.name}__**")
    elif isinstance(target, discord.Member):
        try:
            await target.send(embed=embed)
            await ctx.send(f"**__تم الإرسال إلى {target.mention} بنجاح__**")
        except:
            await ctx.send("**__العضو مغلق الخاص__**")

# --- 5. دليل المساعدة الشامل (!help) إيمبد أسود ---
@bot.command(name="help")
async def help_cmd(ctx):
    embed = discord.Embed(title="📜 دليـل أوامر مـديـنة Rain Town", description="**__نظام الإدارة واللعب الواقعي - برمجة Wilked__**", color=BLACK_COLOR)
    embed.add_field(name="🏢 الإدارة العليا", value="`!say` , `!dm` , `!ايمبد` , `!مسح`", inline=False)
    embed.add_field(name="🏦 الأنظمة العامة", value="`!بنك` , `!انشاء_شخصية` , `!تكت` , `!اكس`", inline=False)
    embed.set_footer(text="developed by wilked")
    await ctx.send(embed=embed)

# --- التوكن في الأسفل ---
DISCORD_TOKEN = "ضع_التوكن_هنا"
bot.run(DISCORD_TOKEN)
