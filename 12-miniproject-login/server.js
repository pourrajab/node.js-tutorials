const http = require("http");
const { randomInt } = require("crypto");

// ذخیره موقت کدهای تأیید (در حافظه - فقط برای تست)
const otpStore = new Map();

const server = http.createServer((req, res) => {
  // اجازه دسترسی از فرانت‌اند (CORS)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // مدیریت درخواست‌های پیش‌پرواز (Preflight) در CORS
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // فقط اجازه POST می‌دهیم
  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("روش مجاز نیست");
    return;
  }

  // استخراج مسیر درخواست به روش امن‌تر (جایگزین url.parse)
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const path = urlObj.pathname;

  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    // تبدیل داده‌های فرم به آبجکت
    const postData = Object.fromEntries(
      body.split("&").map((pair) => {
        const [key, value] = pair.split("=");
        return [key, decodeURIComponent(value || "")];
      })
    );

    // مسیر ارسال کد تأیید
    if (path === "/send-code") {
      const mobile = postData.mobile?.trim();

      if (!mobile) {
        res.writeHead(400, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(JSON.stringify({ error: "شماره موبایل الزامی است" }));
        return;
      }

      // حذف احتمالی صفر اول اگر کاربر با +98 وارد کرده باشه (اختیاری)
      if (mobile.startsWith("+98")) {
        mobile = "0" + mobile.slice(3);
      }

      // ولیدیشن دقیق شماره موبایل ایرانی
      const mobileRegex = /^09[0-9]{9}$/;
      if (!mobileRegex.test(mobile)) {
        res.writeHead(400, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(
          JSON.stringify({
            error:
              "شماره موبایل نامعتبر است. لطفاً یک شماره معتبر ایرانی وارد کنید (مثل 09123456789)",
          })
        );
        return;
      }

      // تولید کد ۶ رقمی تصادفی امن
      const otp = randomInt(100000, 999999);

      // ذخیره کد در حافظه (کلید: شماره موبایل)
      otpStore.set(mobile, otp);

      // در پروژه واقعی اینجا باید کد رو با SMS بفرستی
      // الان فقط در کنسول نمایش می‌دیم تا بتونی تست کنی
      console.log(`کد تأیید برای ${mobile}: ${otp}`);

      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(
        JSON.stringify({
          message: "کد تأیید ارسال شد",
          otp: otp,
        })
      );
    }

    // مسیر بررسی کد تأیید
    else if (path === "/verify-code") {
      const mobile = postData.mobile?.trim();
      const otpInput = parseInt(postData.otp, 10);

      if (!mobile || isNaN(otpInput)) {
        res.writeHead(400, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(
          JSON.stringify({ error: "شماره موبایل و کد تأیید الزامی است" })
        );
        return;
      }

      const storedOtp = otpStore.get(mobile);

      if (storedOtp === otpInput) {
        // کد درست بود → پاک کردن کد (برای جلوگیری از استفاده مجدد)
        otpStore.delete(mobile);
        res.writeHead(200, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(JSON.stringify({ message: "ورود با موفقیت انجام شد" }));
      } else {
        res.writeHead(401, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(
          JSON.stringify({ error: "کد اشتباه است، لطفاً کد صحیح را وارد کنید" })
        );
      }
    }

    // مسیر نامعتبر
    else {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("مسیر یافت نشد");
    }
  });
});

// سرور روی پورت ۳۰۰۰ اجرا می‌شود
server.listen(3000, () => {
  console.log("سرور در حال اجرا روی http://localhost:3000");
});
