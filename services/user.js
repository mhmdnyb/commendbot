const userModel = require("../models/users");

async function addBalance(userId, amount, ctx) {
  if (!userId || !String(userId).trim()) {
    console.error("Invalid userId provided to addBalance");
    if (ctx && typeof ctx.reply === "function") {
      try {
        await ctx.reply("آیدی کاربر نامعتبر است.<tg-emoji emoji-id=5846210329700217522>❌</tg-emoji>", { parse_mode: "HTML" });
      } catch (err) {
        console.error(err);
      }
    }
    return null;
  }

  const numAmount = Number(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    console.error("Invalid amount provided to addBalance");
    if (ctx && typeof ctx.reply === "function") {
      try {
        await ctx.reply("مبلغ ارسالی نامعتبر است.<tg-emoji emoji-id=5846210329700217522>❌</tg-emoji>", { parse_mode: "HTML" });
      } catch (err) {
        console.error(err);
      }
    }
    return null;
  }

  try {
    const user = await userModel.findOne({ where: { userId: String(userId).trim() } });
    if (!user) {
      console.error(`User ${userId} not found`);
      if (ctx && typeof ctx.reply === "function") {
        try {
          await ctx.reply("کاربر یافت نشد!<tg-emoji emoji-id=5846210329700217522>❌</tg-emoji>", { parse_mode: "HTML" });
        } catch (err) {
          console.error(err);
        }
      }
      return null;
    }

    user.balance = (user.balance || 0) + numAmount;
    await user.save();
    console.log(`Added ${numAmount} balance to user ${userId}. New balance: ${user.balance}`);
    return user;
  } catch (error) {
    console.error("Error in addBalance:", error);
    if (ctx && typeof ctx.reply === "function") {
      try {
        await ctx.reply("خطایی در تغییر موجودی رخ داد.<tg-emoji emoji-id=5846210329700217522>❌</tg-emoji>", { parse_mode: "HTML" });
      } catch (err) {
        console.error(err);
      }
    }
    return null;
  }
}

module.exports = { addBalance };
