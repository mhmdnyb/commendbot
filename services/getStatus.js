const userModel = require("../models/users");
const { Bot } = require("grammy");
const prevamount = { amount: 0 };
require("dotenv").config();
const bot = new Bot(process.env.TOKEN);
async function getStatus(jobId, interval, ctx) {
  try {
    const response = await fetch(
      `https://resell.cs2commends.com/api/jobs/${jobId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      },
    );
    const data = await response.json();
    const newAmount = data.delivered;

    if (data.status == "running") {
      await ctx.reply(`${data.delivered}/${data.requested} تا کامند انجام شده`);
      if (newAmount != prevamount.amount) {
        const user = await userModel.findOne({
          where: { userId: `${ctx.from.id}` },
        });

        await user.update({
          balance:
            user.dataValues.balance - (newAmount - prevamount.amount) * 2000,
        });
        prevamount.amount = newAmount;
      } else if (data.status == "error") {
        await ctx.reply(
          "خطای ناشناخته <tg-emoji emoji-id=5846210329700217522>❌</tg-emoji>",
        );
      }
    } else {
      await ctx.reply(
        "فرآیند کامندبات با موفقیت به پایان رسید<tg-emoji emoji-id=5249291879366806523>😄</tg-emoji>\nمیتونین از سرور خارج شین!",
        { parse_mode: "HTML" },
      );
      prevamount.amount = 0;
      clearInterval(interval);
    }
    // await bot.api.editMessageText(chatId,messageId,"kir")
  } catch (error) {
    console.log(error);
  }
}
module.exports = getStatus;
