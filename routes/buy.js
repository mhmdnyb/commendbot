const { Composer } = require("grammy");
const { backKeyboard } = require("../keyboards");
const buyRoute = new Composer();
buyRoute.hears("خرید کامند CS2", async (ctx) => {
  //state change so we can track where the user is at
  ctx.session.state = "buying";

  await ctx.reply(
    "تعرفه فعلی کامند بات به شرح زیر میباشد <tg-emoji emoji-id=5470177992950946662>👇</tg-emoji>\nFriendly<tg-emoji emoji-id=5451709985765468632>😀</tg-emoji>-Teacher<tg-emoji emoji-id=5983188862678079056>🇷🇺</tg-emoji>-Leader<tg-emoji emoji-id=5219827798125846744>👑</tg-emoji>:2000T\n\nبه این معنا که برای هر 3 کامند شما مبلغ 2000 تک تومن رو پرداخت میکنید!\n\nبرای مثال:\n<tg-emoji emoji-id=6026040876671700880>🗣</tg-emoji>100 - 100 - 100 کامند : 200 هزار تومان<tg-emoji emoji-id=5224257782013769471>💰</tg-emoji>\n<tg-emoji emoji-id=6026040876671700880>🗣</tg-emoji>200 - 200 - 200 کامند : 400 هزار تومان<tg-emoji emoji-id=5224257782013769471>💰</tg-emoji>\n\nتعداد دلخواه خودتون رو ارسال کنید:",
    { parse_mode: "HTML", reply_markup: backKeyboard },
  );
});
module.exports = buyRoute;
