const { Composer } = require("grammy");
const buyHandlerRoute = new Composer();
const { backKeyboard } = require("../keyboards");
buyHandlerRoute.on(["message:text"], async (ctx) => {
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
            caption:
              "حالا لینک پروفایل استیمت رو بفرست <tg-emoji emoji-id=5453902695419104908>🎮</tg-emoji>:",
            reply_markup: backKeyboard,
            parse_mode: "HTML",
          },
        );
      }
      break;
    case "link":
      if (userProfileRegEx.test(ctx.message.text)) {
        ctx.session.steamProfile = ctx.message.text;
        ctx.session.state = "pending";
      }
      break;
    case "pending":
      const file = await ctx.getFile();
      console.log(file.file_id);
  }
});
module.exports = buyHandlerRoute;
