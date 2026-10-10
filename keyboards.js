const { Keyboard } = require("grammy");

const backKeyboard = new Keyboard()
  .text("بازگشت")
  .icon("5352759161945867747")
  .row()
  .resized();

const menuKeyboard = new Keyboard()
  .text("شارژ کیف پول", { icon_custom_emoji_id: "5224257782013769471" })
  .success()
  .text("خرید کامند CS2")
  .icon("5985373149900839207")
  .success()
  .row()
  .text("سوالات متداول")
  .icon("5339301912716007099")
  .primary()
  .text("حساب کاربری", { icon_custom_emoji_id: "5258011929993026890" })
  .primary()
  .row()
  .text("ارتباط با پشتیبانی")
  .icon("5240464278464515740")
  .danger()
  .row()
  .resized();

const adminKeyboard = new Keyboard()
  .text("اضافه کردن موجودی", { icon_custom_emoji_id: "5224257782013769471" })
  .success()
  .resized()
  .text("لیست کاربران", { icon_custom_emoji_id: "5258011929993026890" })

  .primary()
  .row()
  .text("همگانی به همه کاربران", {
    icon_custom_emoji_id: "5452002597592382164",
  })
  .danger()
  .row()
  .text("سفارشات", { icon_custom_emoji_id: "5192844064793327232" })
  .success();
const commendKeyboard = new Keyboard()
  .text("وصل شدم")
  .success()
  .resized()
  .oneTime();
module.exports = { backKeyboard, menuKeyboard, adminKeyboard, commendKeyboard };
