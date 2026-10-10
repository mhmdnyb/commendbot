const { Composer, Bot } = require("grammy");
const buyHandlerRoute = new Composer();
const { backKeyboard, commendKeyboard } = require("../keyboards");
const { addBalance } = require("../services/user");
const getServer = require("../services/getServer");
const startCommend = require("../services/startCommend");
const userModel = require("../models/users");
const Users = require("../models/users");
const bot = new Bot(process.env.TOKEN);
const getStatus = require("../services/getStatus");
buyHandlerRoute.on(["message:text"], async (ctx) => {
  const user = await Users.findOne({
    where: {
      userId: ctx.from.id,
    },
  });
  console.log(user.dataValues.balance, ctx.session.amount * 2000);

  const numberRegEx = /^[1-9]\d*$/;
  const userProfileRegEx = /(profiles|id)\/([\w-]*)/gm;

  switch (ctx.session.state) {
    case "buying":
      ctx.session.amount = +ctx.message.text;
      if (
        numberRegEx.test(ctx.message.text) &&
        user.dataValues.balance >= 2000 * +ctx.session.amount
      ) {
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
      } else {
        ctx.reply("موجودی کافی نیست");
      }
      break;
    case "link":
      if (userProfileRegEx.test(ctx.message.text)) {
        ctx.session.steamProfile = ctx.message.text;
        ctx.session.state = "pending";
        const data = await getServer(
          {
            amount: +ctx.session.amount,
            steamProfile: ctx.session.steamProfile,
          },
          ctx,
        );
        if (data && data.ok && data.server) {
          await ctx.reply(
            `همین حالا وارد سرور بشو تا بتونی کامندها رو دریافت کنی<tg-emoji emoji-id=5366437533271996949>💬</tg-emoji>!\n<code>${data.server.connectCommand.replace("play.cs2commends.com", "80.147.196.218")}</code>\n توی کنسول بازیت این دستور رو وارد کن\nاگه توی وصل شدن مشکل داشتی از VPN یا پکت رفت استفاده کن!`,
            { reply_markup: commendKeyboard, parse_mode: "HTML" },
          );
        }
      }
      break;
    case "pending":
      const data = await startCommend(
        {
          amount: ctx.session.amount,
          steamProfile: ctx.session.steamProfile,
        },
        ctx,
      );
      if (data.ok) {
        const interval = setInterval(async () => {
          await getStatus(data.job_id, interval, ctx);
        }, 30000);
      }

      break;
    case "addBalance":
      const [userId, amount] = ctx.message.text.trim().split(/[\n\s]+/);
      if (userId && amount) {
        const updated = await addBalance(userId, amount, ctx);
        if (updated) {
          await ctx.reply(
            `موجودی کاربر ${userId} به میزان ${(+amount).toLocaleString()}T افزایش یافت.<tg-emoji emoji-id=5980930633298350051>✅</tg-emoji>`,
            { parse_mode: "HTML" },
          );
          await bot.api.sendMessage(
            userId,
            `مقدار موجودی حساب شما به مبلغ ${(+amount).toLocaleString()}T افزایش یافت <tg-emoji emoji-id=5318783359294382499>😎</tg-emoji>`,
            { parse_mode: "HTML" },
          );
        }
      } else {
        await ctx.reply(
          "فرمت ارسال نامعتبر است. لطفا آیدی و مبلغ را ارسال کنید.<tg-emoji emoji-id=5846210329700217522>❌</tg-emoji>",
          { parse_mode: "HTML" },
        );
      }
      ctx.session.state = "idle";
      break;
    case "announcement":
      if (ctx.message.text === "لغو") {
        ctx.session.state = "idle";
        await ctx.reply("لغو شد");
        return;
      }
      const users = await userModel.findAll();

      if (users) {
        users.forEach(async (item) => {
          try {
            await bot.api.sendMessage(
              item.dataValues.userId,
              `<tg-emoji emoji-id=5452002597592382164>📣</tg-emoji><b> شما یک پیام از پشتیبانی دارید: </b>\n ${ctx.message.text}`,
              { parse_mode: "HTML" },
            );
          } catch (error) {
            console.log(error);
          }
        });
        ctx.session.state = "idle";
      } else {
        await ctx.reply("خطای ناشناخته");
      }
  }
});
module.exports = buyHandlerRoute;
