require("dotenv").config();
const { Bot, Keyboard } = require("grammy");
const database = require("./database");
const userModel = require("./models/users");
const bot = new Bot(process.env.TOKEN);
async function getServer() {
  try {
    const response = await fetch(
      "https://resell.cs2commends.com/api/jobs/prepare",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
        body: JSON.stringify({
          steamProfile: "76561199380117994",
          amount: 100,
        }),
      },
    );

    if (response.ok) {
      const data = await response.json();

      return data;
    }
  } catch (error) {
    console.log(error);
  }
}
bot.command("start", async (ctx) => {
  await userModel.create({
    userId: ctx.from.id,
    username: ctx.from.username,
    first_name: ctx.from.first_name,
    balance: 0,
    amount: 0,
  });
  const keyboard = new Keyboard()
    .text("خرید کامند CS2")
    .icon("5985373149900839207")
    .success()
    .row()
    .text("سوالات متداول")
    .icon("5339301912716007099")
    .primary()
    .row()
    .text("ارتباط با پشتیبانی")
    .icon("5240464278464515740")
    .danger()
    .row()
    .resized();
  await ctx.reply(
    `سلام <tg-emoji emoji-id=${"5393527657239451953"}>👋</tg-emoji>\nممنون از اینکه ما رو انتخاب کردین!\n\nاز منو زیر یک گزینه رو انتخاب کنید<tg-emoji emoji-id=${"5197474438970363734"}>⤵️</tg-emoji>`,
    { parse_mode: "HTML", reply_markup: keyboard },
  );
});
bot.hears("خرید کامند CS2", async (ctx) => {
  await ctx.reply("buy");
});

const startServer = async () => {
  try {
    await database.sync({ force: true });
    bot.start();
  } catch (error) {
    console.log(error);
  }
};
startServer();
