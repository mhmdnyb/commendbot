const { Composer } = require("grammy");
const auth = require("../auth");
const { adminKeyboard } = require("../keyboards");
const panelRoute = new Composer();
panelRoute.command("panel", auth, async (ctx) => {
  await ctx.reply(`خوش برگشتی رییس! ${ctx.from.first_name}`, {
    reply_markup: adminKeyboard,
  });
});

panelRoute.hears("اضافه کردن موجودی", auth, async (ctx) => {
  ctx.session.state = "addBalance";
  await ctx.reply(
    "به چه کسی و چه مقدار میخوای اضافه کنی؟<tg-emoji emoji-id=5298913899985264121>🤔</tg-emoji>",
    { parse_mode: "HTML" },
  );
});
module.exports = panelRoute;
