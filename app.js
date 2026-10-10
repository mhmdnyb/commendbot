require("dotenv").config();
const { Menu } = require("@grammyjs/menu");
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
const { addBalance } = require("./services/user");
bot.use(session({ initial }));
const { backKeyboard, menuKeyboard } = require("./keyboards");
const auth = require("./auth");

bot.use(startRoute);
bot.use(panelRoute);
bot.use(buyRoute);
bot.hears("بازگشت", async (ctx) => {
  ctx.session.state = "idle";
  await ctx.reply("به منو اصلی برگشتید", { reply_markup: menuKeyboard });
});
bot.hears("لیست کاربران", auth, async (ctx) => {
  const users = await userModel.findAll();
  let userList;
  users.forEach((item) => {
    userList =
      userList +
      `<tg-emoji emoji-id=5215613971352004352>➡️</tg-emoji>${item.dataValues.userId}-@${item.dataValues.username}-${item.dataValues.first_name.trim() ? item.dataValues.first_name : "null"}-${item.dataValues.balance.toLocaleString()}T\n`;
  });
  await ctx.reply(userList, { parse_mode: "HTML" });
});
bot.hears("حساب کاربری", async (ctx) => {
  const temp = await ctx.reply(
    "در حال بارگذاری...<tg-emoji emoji-id=4990412201614378299>🔵</tg-emoji>",
    { parse_mode: "HTML" },
  );
  setTimeout(async () => {
    const user = await userModel.findOne({
      where: {
        userId: ctx.from.id,
      },
    });
    const myEmoji = "<tg-emoji emoji-id=5213358684024877471>➡️</tg-emoji>";
    await bot.api.editMessageText(
      temp.chat.id,
      temp.message_id,
      `${myEmoji} شناسه کاربری: ${user.dataValues.userId}\n\n${myEmoji} مقدار موجودی: ${user.dataValues.balance.toLocaleString()}T\n\n${myEmoji} تعداد کامند خریداری شده: ${user.dataValues.amount}\n`,
      { parse_mode: "HTML" },
    );
  }, 1000);
});
bot.hears("همگانی به همه کاربران", auth, async (ctx) => {
  ctx.session.state = "announcement";
  await ctx.reply("چه پیامی میخوای بفرستی؟");
});
bot.hears("product", async (ctx) => {
  const user = await userModel.findOne({ where: { userId: ctx.from.id } });
  const product = await productModel.create({
    orderId: "123",
    userId: user.dataValues.id,
  });
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
    productModel.belongsTo(userModel);
    userModel.hasMany(productModel);
    await database.sync({ force: false });

    const http = require("http");
    const PORT = process.env.PORT || 3000;
    http.createServer((req, res) => {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Bot is running!");
    }).listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });

    bot.start();
  } catch (error) {
    console.log(error);
  }
};

startServer();
module.exports = { menuKeyboard, backKeyboard, initial, addBalance };
