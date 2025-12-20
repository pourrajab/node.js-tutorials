const http = require("http");
const fs = require("fs");
const path = require("path");
const { randomInt } = require("crypto");

const PORT = 3000;
const DATA_FILE = path.join(__dirname, "urls.json");
const BASE_URL = `http://localhost:${PORT}`; // در تولید به دامنه واقعی تغییر بده

// تابع ایمن خواندن لینک‌ها
function readUrls() {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const data = fs.readFileSync(DATA_FILE, "utf-8").trim();
    if (data === "") return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("خطا در خواندن urls.json:", err.message);
    return [];
  }
}

// تابع ذخیره لینک‌ها
function writeUrls(urls) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(urls, null, 2), "utf-8");
  } catch (err) {
    console.error("خطا در نوشتن urls.json:", err.message);
  }
}

// تولید کد کوتاه منحصر به فرد (6 کاراکتر الفانومریک)
function generateShortCode() {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[randomInt(0, chars.length)];
  }
  return code;
}

const server = http.createServer((req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const pathname = urlObj.pathname;

  // CORS برای فرانت‌اند
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const urls = readUrls();

  // GET / → صفحه اصلی (اگر بخوای مستقیم سرو کنی، یا از static server استفاده کن)
  // ما از static server استفاده می‌کنیم، پس این رو فقط برای تست نگه می‌داریم

  // GET /api/urls → لیست همه لینک‌ها (برای فرانت‌اند)
  if (req.method === "GET" && pathname === "/api/urls") {
    const publicUrls = urls.map((item) => ({
      shortCode: item.shortCode,
      shortUrl: `${BASE_URL}/${item.shortCode}`,
      originalUrl: item.originalUrl,
      clicks: item.clicks || 0,
      createdAt: item.createdAt,
    }));
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(publicUrls));
    return;
  }

  // POST /api/shorten → کوتاه کردن لینک جدید
  if (req.method === "POST" && pathname === "/api/shorten") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const { url } = JSON.parse(body);
        if (!url || !url.startsWith("http")) {
          res.writeHead(400, {
            "Content-Type": "application/json; charset=utf-8",
          });
          res.end(
            JSON.stringify({
              error: "لطفاً یک URL معتبر وارد کنید (با http یا https)",
            })
          );
          return;
        }

        let shortCode;
        do {
          shortCode = generateShortCode();
        } while (urls.find((item) => item.shortCode === shortCode)); // منحصر به فرد بودن

        const newEntry = {
          shortCode,
          originalUrl: url,
          clicks: 0,
          createdAt: new Date().toISOString(),
        };

        urls.push(newEntry);
        writeUrls(urls);

        res.writeHead(201, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(
          JSON.stringify({
            message: "لینک با موفقیت کوتاه شد",
            shortUrl: `${BASE_URL}/${shortCode}`,
            originalUrl: url,
          })
        );
      } catch (err) {
        res.writeHead(400, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(JSON.stringify({ error: "داده نامعتبر" }));
      }
    });
    return;
  }

  // GET /:shortCode → ریدایرکت به لینک اصلی
  if (req.method === "GET" && pathname.length > 1) {
    const shortCode = pathname.slice(1);
    const entry = urls.find((item) => item.shortCode === shortCode);

    if (entry) {
      // افزایش شمارنده کلیک
      entry.clicks = (entry.clicks || 0) + 1;
      writeUrls(urls);

      res.writeHead(301, { Location: entry.originalUrl });
      res.end();
      return;
    }
  }

  // مسیر نامعتبر
  res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
  res.end(`
    <h1 style="text-align:center; margin-top:100px; font-family: Tahoma;">۴۰۴ - لینک یافت نشد</h1>
    <p style="text-align:center;"><a href="/">برگشت به صفحه اصلی</a></p>
  `);
});

server.listen(PORT, () => {
  console.log(`کوتاه‌کننده لینک در حال اجرا روی http://localhost:${PORT}`);
  console.log(`صفحه اصلی: http://localhost:8080 (با سرور استاتیک)`);
});
