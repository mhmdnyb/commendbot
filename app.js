require("dotenv").config();
const { Bot, Keyboard, session } = require("grammy");
const database = require("./database");

const userModel = require("./models/users");
const productModel = require("./models/products");
const startRoute = require("./command/start");
const panelRoute = require("./command/panel");
const buyRoute = require("./routes/buy");
const buyHandlerRoute = require("./routes/buyHandler");
const bot = new Bot(process.env.TOKEN);

//session implementation so we can store data
function initial() {
  return { amount: null, steamProfile: null, state: "idle" };
}
bot.use(session({ initial }));
const { backKeyboard, menuKeyboard } = require("./keyboards");
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
bot.use(startRoute);
bot.use(panelRoute);
bot.use(buyRoute);
bot.hears("بازگشت", async (ctx) => {
  ctx.session.state = "idle";
  await ctx.reply("به منو اصلی برگشتید", { reply_markup: menuKeyboard });
});

bot.use(buyHandlerRoute);
//hanel payment
bot.on("message:photo", async (ctx) => {
  if (ctx.session.state == "topup") {
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
module.exports = { menuKeyboard, backKeyboard, initial };
