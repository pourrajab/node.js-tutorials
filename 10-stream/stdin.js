const { createWriteStream } = require("fs");

const writeStream = createWriteStream("./stdin.txt");

process.stdin.pipe(writeStream);


//راه اندازی استریم از ترمینال به داخل فایل
// بعد از راه اندازی هر متنی داخل ترمینال بنویسیم داخل فایل مربوطه ذخیره می شود