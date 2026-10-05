const { Composer } = require("grammy");
const auth = require("../auth");
const panelRoute = new Composer();
panelRoute.command("panel", auth, async (ctx) => {
  await ctx.reply("you're an admin");
});
module.exports = panelRoute;
