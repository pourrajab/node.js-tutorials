// سازنده توابع خواندن فایل و اطلاعات آن از کتابخانه پیش‌فرض fs
const { createReadStream, statSync } = require("fs");
// کتابخانه HTTP برای راه‌اندازی سرور ساده
const http = require("http");

// نام فایل ویدیویی که قرار است توسط سرور استریم یا پخش شود
const fileName = "video.mp4";

// ایجاد سرور HTTP
http
  .createServer(async (req, res) => {
    // ایجاد یک ReadStream برای فایل (برای حالت پخش عادی بدون ریترت)
    const readStream = createReadStream(fileName);
    // گرفتن اندازه فایل به کمک statSync
    const { size } = statSync(fileName);
    // مقدار هدر Range از درخواست کاربر برای استریم قسمتی از فایل
    const range = req.headers.range;

    // اگر کاربر درخواست بخش خاصی از فایل را داده باشد
    if (range) {
      // استخراج بازه درخواست شده به صورت start و end
      let [start, end] = range.replace(/bytes=/, "").split("-");
      start = parseInt(start, 10);
      end = end ? parseInt(end, 10) : size - 1;

      // پاسخ به درخواست با کد 206 (Partial Content)
      res.writeHead(206, {
        // محدوده واقعی که قرار است فرستاده شود
        "Content-Range": `bytes ${start} - ${end} / ${size}`,
        // اعلام اینکه سرور از درخواست‌های محدوده پشتیبانی می‌کند
        "Accept-Range": "bytes",
        // طول داده‌ای که فرستاده می‌شود
        // توجه: این مقدار باید برابر با (end - start + 1) باشد
        "Content-Length": end - start + 1,
        // مشخص کننده نوع محتوای ویدیو
        "Content-type": "video/mp4",
      });
      // خواندن بخش مشخص شده از فایل و فرستادن به پاسخ
      createReadStream(fileName, { start, end }).pipe(res);
    } else {
      // اگر کاربر کل فایل را درخواست کند (بدون Range)
      res.writeHead(200, {
        "Content-type": "video/mp4",
        "Content-Length": size,
      });
      // پخش کل فایل با استفاده از ReadStream
      readStream.pipe(res);
    }
  })
  // پورت listen شده برای سرور
  .listen(3000);

console.log("listen to port 3000 : http://localhost:3000");
