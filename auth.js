const adminList = [1875341048];
async function auth(ctx, next) {
  if (!adminList.includes(ctx.from.id)) {
    return;
  }
  await next();
}
module.exports = auth;
