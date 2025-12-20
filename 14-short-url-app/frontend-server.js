const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  // فقط درخواست اصلی رو سرو کنیم
  if (req.url === "/" || req.url === "/index.html") {
    const filePath = path.join(__dirname, "index.html");
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end("خطا در بارگذاری صفحه");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(content);
    });
  } else {
    res.writeHead(404);
    res.end("صفحه یافت نشد");
  }
});

server.listen(8080, () => {
  console.log("فرانت‌اند در حال اجرا روی http://localhost:8080");
  console.log("صفحه رو از این آدرس باز کن: http://localhost:8080");
});
