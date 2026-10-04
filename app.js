require("dotenv").config();
const { Bot, Keyboard, session } = require("grammy");
const database = require("./database");
const userModel = require("./models/users");
const bot = new Bot(process.env.TOKEN);

//session implementation so we can store data
function initial() {
  return { amount: null, steamProfile: null, state: "idle" };
}
bot.use(session({ initial }));
//menu keyboard
const Menukeyboard = new Keyboard()
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

//on start command
bot.command("start", async (ctx) => {
  try {
    await userModel.create({
      userId: ctx.from.id,
      username: ctx.from.username,
      first_name: ctx.from.first_name,
      balance: 0,
      amount: 0,
    });
  } catch (error) {}

  await ctx.reply(
    `سلام <tg-emoji emoji-id=${"5393527657239451953"}>👋</tg-emoji>\nممنون از اینکه ما رو انتخاب کردین!\n\nاز منو زیر یک گزینه رو انتخاب کنید<tg-emoji emoji-id=${"5197474438970363734"}>⤵️</tg-emoji>`,
    { parse_mode: "HTML", reply_markup: Menukeyboard },
  );
});
bot.hears("خرید کامند CS2", async (ctx) => {
  //state change so we can track where the user is at
  ctx.session.state = "buying";

  const keyboard = new Keyboard()
    .text("بازگشت")
    .icon("5352759161945867747")
    .row()
    .resized();
  await ctx.reply(
    "تعرفه فعلی کامند بات به شرح زیر میباشد <tg-emoji emoji-id=5470177992950946662>👇</tg-emoji>\nFriendly<tg-emoji emoji-id=5451709985765468632>😀</tg-emoji>-Teacher<tg-emoji emoji-id=5983188862678079056>🇷🇺</tg-emoji>-Leader<tg-emoji emoji-id=5219827798125846744>👑</tg-emoji>:2000T\n\nبه این معنا که برای هر 3 کامند شما مبلغ 2000 تک تومن رو پرداخت میکنید!\n\nبرای مثال:\n<tg-emoji emoji-id=6026040876671700880>🗣</tg-emoji>100 - 100 - 100 کامند : 200 هزار تومان<tg-emoji emoji-id=5224257782013769471>💰</tg-emoji>\n<tg-emoji emoji-id=6026040876671700880>🗣</tg-emoji>200 - 200 - 200 کامند : 400 هزار تومان<tg-emoji emoji-id=5224257782013769471>💰</tg-emoji>\n\nتعداد دلخواه خودتون رو ارسال کنید:",
    { parse_mode: "HTML", reply_markup: keyboard },
  );
});
bot.hears("بازگشت", async (ctx) => {
  ctx.session.state = "idle";
  await ctx.reply("به منو اصلی برگشتید", { reply_markup: Menukeyboard });
});
bot.on("message:text", async (ctx) => {
  const numberRegEx = /^[1-9]\d*$/;
  const userProfileRegEx = /(profiles|id)\/([\w-]*)/gm;
  console.log("switch");

  switch (ctx.session.state) {
    case "buying":
      if (numberRegEx.test(ctx.message.text)) {
        ctx.session.amount = ctx.message.text;
        ctx.session.state = "link";
        await ctx.replyWithAnimation(
          "CgACAgQAAxkBAAIBgmrCuYVwIgzLoudTP8OMSjHecppxAALhIwAC84EZUjzlxD2vXH7vPQQ",
          {
            caption: "حالا لینک پروفایل استیمت رو بفرست:",
          },
        );
      }
      break;
    case "link":
      if (userProfileRegEx.test(ctx.message.text)) {
        ctx.session.steamProfile = ctx.message.text;
      }
      break;
  }
});
// bot.hears(/^[1-9]\d*$/, async (ctx) => {
//   if (ctx.session.state == "buying") {
//     ctx.session.amount = ctx.message.text;
//     ctx.session.state = "link";
//   }
// });
// bot.hears(/(profiles|id)\/([\w-]*)/gm, async (ctx) => {
//   if (ctx.session.state == "link") {
//     ctx.session.steamProfile = ctx.message.text;
//     console.log(ctx.session);
//   }
// });
const startServer = async () => {
  try {
    await database.sync({ force: true });
    bot.start();
  } catch (error) {
    console.log(error);
  }
};

startServer();
