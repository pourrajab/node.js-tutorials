const { createWriteStream } = require("fs");
const http = require("http");
const multiparty = require("multiparty");

// ایجاد سرور HTTP
http
  .createServer((req, res) => {
    const { url, method } = req;

    // درخواست POST به ریشه / برای آپلود فایل
    if (url == "/" && method == "POST") {
      // تشکیل فرم چند قسمتی (multipart) برای پردازش فایل‌ها
      let form = new multiparty.Form();

      // پارس کردن درخواست با استفاده از کتابخانه multiparty
      form.parse(req);

      // رویداد وقتی بخشی از فرم رسیده (هر فایل یا داده‌ای که به عنوان Part ارسال می‌شود)
      form.on("part", (part) => {
        // بخش (part) را به فایل با نام filename در پوشه stream می‌نویسیم
        part
          .pipe(createWriteStream(`./stream/${part.filename}`))
          .on("close", () => {
            // به کاربر پاسخ می‌دهیم که فایل با موفقیت آپلود شد
            res.writeHead(200, { "Content-type": "text/html" });
            res.end(`
                  <h1>File Uploaded : ${part.filename} </h1>
                  `);
          });
      });
    } else {
      // هر درخواست غیر از POST به مسیر /: صفحه فرم آپلود را نمایش می‌دهد
      res.writeHead(200, { "Content-type": "text/html" });
      res.end(`
            <form enctype="multipart/form-data" method="POST" action="/">  
                <input type="file" name="upload-file">
                <button>send</button>
            </form>
            `);
    }
  })
  .listen(3000);

console.log("listen to port 3000 : http://localhost:3000");
//آپلود فایل در نود جی اس
