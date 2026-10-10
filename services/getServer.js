async function notifyError(context, err) {
  if (!context || typeof context.reply !== "function") {
    return;
  }
  let message;
  if (err.error_code === "TARGET_NOT_ONLINE") {
    message = "اکانت استیم شما در سرور CS2 آنلاین نیست. لطفا ابتدا وارد سرور شوید.<tg-emoji emoji-id=5846210329700217522>❌</tg-emoji>";
  } else if (err.error_code === "INSUFFICIENT_BALANCE") {
    message = "موجودی حساب کافی نیست.<tg-emoji emoji-id=5846210329700217522>❌</tg-emoji>";
  } else if (err.error_code === "CONCURRENCY_LIMIT") {
    message = "تعداد سفارش‌های همزمان به حد نصاب رسیده است. لطفا دقایقی دیگر تلاش کنید.<tg-emoji emoji-id=5846210329700217522>❌</tg-emoji>";
  } else if (err.error_code === "DAILY_LIMIT") {
    message = "سقف سفارش روزانه تکمیل شده است.<tg-emoji emoji-id=5846210329700217522>❌</tg-emoji>";
  } else if (err.error_code === "API_NOT_IN_PLAN") {
    message = "دسترسی API در پلن فعلی فعال نیست.<tg-emoji emoji-id=5846210329700217522>❌</tg-emoji>";
  } else if (err.error_code === "BAD_INPUT") {
    message = `اطلاعات ارسالی نامعتبر است.<tg-emoji emoji-id=5846210329700217522>❌</tg-emoji>`;
  } else {
    message = `خطایی رخ داد: ${err.error || "خطای ناشناخته"}<tg-emoji emoji-id=5846210329700217522>❌</tg-emoji>`;
  }
  try {
    await context.reply(message, { parse_mode: "HTML" });
  } catch (replyError) {
    console.error(replyError);
  }
}

async function getServer(credentials, ctx) {
  const context = ctx || (credentials && credentials.ctx);

  if (!credentials) {
    const err = { ok: false, error: "Missing credentials", error_code: "BAD_INPUT", status: 400 };
    console.error(err);
    await notifyError(context, err);
    return err;
  }

  const { amount, steamProfile, split } = credentials;

  if (!steamProfile || typeof steamProfile !== "string" || !steamProfile.trim()) {
    const err = { ok: false, error: "Missing or invalid steamProfile", error_code: "BAD_INPUT", status: 400 };
    console.error(err);
    await notifyError(context, err);
    return err;
  }

  const numAmount = Number(amount);
  const hasValidAmount = Number.isInteger(numAmount) && numAmount > 0 && numAmount <= 8000;
  const hasValidSplit = split && typeof split === "object";

  if (!hasValidAmount && !hasValidSplit) {
    const err = { ok: false, error: "Amount must be a whole number between 1 and 8000, or a valid split object", error_code: "BAD_INPUT", status: 400 };
    console.error(err);
    await notifyError(context, err);
    return err;
  }

  if (!process.env.API_KEY) {
    const err = { ok: false, error: "Missing API_KEY in environment variables", status: 401 };
    console.error(err);
    await notifyError(context, err);
    return err;
  }

  try {
    const body = {
      steamProfile: steamProfile.trim(),
    };

    if (hasValidAmount) {
      body.amount = numAmount;
    }

    if (hasValidSplit) {
      body.split = split;
    }

    const response = await fetch(
      "https://resell.cs2commends.com/api/jobs/prepare",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
        body: JSON.stringify(body),
      },
    );

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      const err = {
        ok: false,
        status: response.status,
        error: response.statusText || "Invalid JSON response from server",
      };
      console.error(err);
      await notifyError(context, err);
      return err;
    }

    if (!response.ok || !data.ok) {
      const err = {
        ok: false,
        status: response.status,
        error: data.error || response.statusText || "Request failed",
        error_code: data.error_code || null,
        ...(data.balance !== undefined && { balance: data.balance }),
        ...(data.required !== undefined && { required: data.required }),
        ...(data.retry_after_ms !== undefined && { retry_after_ms: data.retry_after_ms }),
      };
      console.error(err);
      await notifyError(context, err);
      return err;
    }

    return data;
  } catch (error) {
    const err = {
      ok: false,
      error: error.message || "Network error",
    };
    console.error(err);
    await notifyError(context, err);
    return err;
  }
}

module.exports = getServer;
