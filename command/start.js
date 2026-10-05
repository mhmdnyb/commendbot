const { Composer } = require("grammy");
const userModel = require("../models/users");
const { menuKeyboard } = require("../keyboards");
const startRoute = new Composer();
//on start command
startRoute.command("start", async (ctx) => {
  try {
    await userModel.create({
      userId: ctx.from.id,
      username: ctx.from.username,
      first_name: ctx.from.first_name,
      balance: 0,
      amount: 0,
    });
  } catch (error) {}
  ctx.session.state = "idle";

  await ctx.reply(
    `سلام <tg-emoji emoji-id=${"5393527657239451953"}>👋</tg-emoji>\nممنون از اینکه ما رو انتخاب کردین!\n\nاز منو زیر یک گزینه رو انتخاب کنید<tg-emoji emoji-id=${"5197474438970363734"}>⤵️</tg-emoji>`,
    { parse_mode: "HTML", reply_markup: menuKeyboard },
  );
});
module.exports = startRoute;
