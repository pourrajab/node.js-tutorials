//بافر یک مکان ذخیره سازی است برای ذخیره موقت دیتاها و دیتاهای اصلی را تکه تکه درون خودش ذخیره می کند و زمانی که پر شد دیتا را برای پردازش انتقال می دهد

// let buff = Buffer.from("NodeJs");
// console.log(buff);
// console.log(buff[0]);
// console.log("N".charCodeAt(0));
// console.log("N".codePointAt(0));
// console.log("N".charCodeAt(0).toString(16));
// console.log(buff.toString());

// alloc : میزان حافظه ای که می توان به بافر اختصاص داد و تا 256 می توان به آن داد
// let buff = Buffer.alloc(4);
// buff.write("Nodejs");
// console.log(buff);

let buffer = Buffer.from("NodeJs");
//با استفاده از این متد می توان بافر را به JSON تبدیل کرد.
console.log(buffer.toJSON());
console.log(typeof buffer);
const buffer2 = Buffer.from([78, 111, 100, 101, 74, 115], "hex");
//از این متد برای تبدیل بافر به رشته استفاده می‌شود.
console.log(buffer2.toString());
