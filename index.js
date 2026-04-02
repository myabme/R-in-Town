import discord
from discord.ext import commands
from discord.ui import Select, View, Button

# --- إعدادات البوت الأساسية ---
intents = discord.Intents.all()
bot = commands.Bot(command_prefix='!', intents=intents, help_command=None)

# --- قاعدة بيانات الأنظمة ---
players = {} 
BANNED_LEGENDS = ["ماثيو", "كافح", "المكافح", "راكان", "جسار", "عقاب", "صخر", "شيبان", "هتلر", "ديربي", "عقيل", "جبر"]

# --- إعداد حالة البوت (Streaming) ---
@bot.event
async def on_ready():
    activity = discord.Streaming(
        name="Rain Town RP | Dev By Wilked", 
        url="https://www.twitch.tv/wilked"
    )
    await bot.change_presence(activity=activity)
    print(f"**__[تم تشغيل نظام رين تاون بنجاح]__**")

# --- 1. نظام البنك المتطور (قائمة منسدلة) ---
class BankOptions(Select):
    def __init__(self):
        options = [
            discord.SelectOption(label="فـلـوسـي | My Balance", description="الاستعلام عن الرصيد الحالي", emoji="💰"),
            discord.SelectOption(label="تـحـويـل | Transfer", description="تحويل الأموال إلى مواطن آخر", emoji="💸"),
            discord.SelectOption(label="إيـداع | Deposit", description="إيداع الأموال في الحساب البنكي", emoji="🏦"),
        ]
        super().__init__(placeholder="اختر العملية البنكية المطلوبة...", options=options)

    async def callback(self, interaction: discord.Interaction):
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

# --- 2. نظام إنشاء الشخصية (فصحى + فحص) ---
@bot.command(name="انشاء_شخصية")
async def create_id(ctx, name: str, age: int):
    user_name = name.strip()
    
    # فحص الأسماء الممنوعة
    if any(legend in user_name for legend in BANNED_LEGENDS):
        embed = discord.Embed(title="❌ رَفـض الـتـسـجـيـل", description=f"**__عـذراً {ctx.author.mention}، هـذا الاسـم مـمـنـوع لـديـنـا__**", color=0x000000)
        return await ctx.send(embed=embed)

    # فحص الأسماء المتكررة
    for p_id in players:
        if players[p_id].get('identity') and players[p_id]['identity']['name'] == user_name:
            embed = discord.Embed(title="❌ رَفـض الـتـسـجـيـل", description=f"**__عـذراً {ctx.author.mention}، هـذا الاسـم مـتـكـرر ولا يـمـكـن مـنـحه لـك__**", color=0x000000)
            return await ctx.send(embed=embed)

    if not (20 <= age <= 45):
        return await ctx.send("**__يـجـب أن يـكـون الـعـمر مـا بـين 20 و 45 عـامـاً__**")

    players[ctx.author.id] = {"money": 5000, "identity": {"name": user_name, "age": age}}
    embed = discord.Embed(title="🆔 هـويـة Rain Town", description=f"**__تـم تـسـجـيـل بـيـانـاتـك الـرسـمـيـة بـنـجـاح__**\n\n**__الاسـم: {user_name}__**\n**__الـعـمر: {age}__**\n**__الـرصـيد: 5000$__**", color=0x000000)
    embed.set_footer(text="developed by wilked")
    await ctx.send(embed=embed)

# --- 3. أمر المساعدة الشامل (!help) ---
@bot.command(name="help")
async def help_cmd(ctx):
    embed = discord.Embed(title="📜 دليـل أوامر مـديـنة Rain Town", description="**__جـمـيـع الأوامـر والأنـظـمة الـمـتـوفـرة مـن بـرمـجـة Wilked__**", color=0x000000)
    
    embed.add_field(name="🏦 الـنـظام الـبـنـكي", value="`!بنك` - `!حوالة` - `!ارسال_البنك`", inline=False)
    embed.add_field(name="🆔 نـظام الـهـويـة", value="`!انشاء_شخصية` - `!حقيبة`", inline=False)
    embed.add_field(name="🛒 الـتـجارة والـورشة", value="`!متجر` - `!شراء` - `!تصنيع` - `!اضافه_غرض`", inline=False)
    embed.add_field(name="📱 الـتـواصـل والـدعم", value="`!اكس` - `!تغريدة` - `!تكت` - `!ايمبد`", inline=False)
    
    embed.set_footer(text="developed by wilked")
    await ctx.send(embed=embed)

# --- 4. أوامر إرسال الإيمبدات الرسمية ---
@bot.command()
@commands.has_permissions(administrator=True)
async def ارسال_البنك(ctx):
    embed = discord.Embed(title="🏦 مـركـز ريـن بـانـك الـرسـمـي | Rain Bank", description="**__مـرحـبـاً بـك فـي الـنـظـام الـمـصـرفـي\nيـرجى اخـتـيار الـخـدمة الـمـطـلـوبة مـن الـقـائمة أدناه__**", color=0x000000)
    embed.set_footer(text="developed by wilked")
    await ctx.send(embed=embed, view=BankView())
    await ctx.message.delete()

# --- التوكن في الأسفل ---
DISCORD_TOKEN = "ضع_التوكن_هنا"

if __name__ == "__main__":
    bot.run(DISCORD_TOKEN)
