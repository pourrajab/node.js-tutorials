const fs = require("fs");
// fs:یکی از ماژول‌های اصلی Node. js است؛ که برای کار با فایل‌ها و دایرکتوری‌ها در سیستم فایل محلی استفاده می‌شود. با استفاده از ماژول fs می‌توانید فایل‌ها را بخوانید، بنویسید، به آن‌ها دسترسی پیدا کنید و به آن‌ها عملیات‌های مختلفی از جمله کپی کردن، جابه‌جایی، تغییر نام و حذف کردن را اعمال کنید

//Blocking code - nonBlocking code

//non-blocking
// console.log("first Log");
// fs.readFile("package.json", function(err, data) {
//     if(err) {
//         console.log(err);
//     }else {
//         console.log(data.toString());
//     }
// })

// console.log("SecondLog");
//blocking
console.log("First Log");
const data = fs.readFileSync("package.json", "utf-8");
console.log(data);
console.log("Second Log");
