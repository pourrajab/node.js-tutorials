const fs = require("fs");
let data = "Hello New File!\n";
// fs.writeFile("write.txt", data, (err) => {
//     if(err){
//         console.log(err);
//     }else{
//         console.log("write in file done!");
//     }
// })
fs.writeFile("write.txt", data, { flag: "a", encoding: "utf-8" }, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("write in file done!");
  }
});

// { flag: 'w' }: نوشتن و بازنویسی فایل (اگر وجود نداشته باشد، ایجاد می‌کند).
// { flag: 'a' }: اضافه کردن به انتهای فایل (اگر وجود ندارد، ایجاد می‌کند).
// { flag: 'r+' }: خواندن و نوشتن بدون قطع فایل.
// { flag: 'ax' }: تلاش برای اضافه کردن فقط اگر فایل وجود نداشته باشد.


// fs.writeFileSync('write.txt', data)
