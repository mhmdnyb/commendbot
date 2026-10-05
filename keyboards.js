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
  .row()
  .text("ارتباط با پشتیبانی")
  .icon("5240464278464515740")
  .danger()
  .row()
  .resized();

module.exports = { backKeyboard, menuKeyboard };
