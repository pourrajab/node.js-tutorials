const fs = require("fs");
//خواندن استریم
const readStreamData = fs.createReadStream("./file.txt");
//نمایش دیتا بصورت utf-8
// const readStreamData = fs.createReadStream("./file.txt" , "utf8");
//نوشتن استریم
const writeStreamData = fs.createWriteStream("./write.txt");

//برای خواندن استریم

// let buffer = [];
// readStreamData.on("ready", () => {
//   console.log("read Data stream");
// });

// readStreamData.on("data", (chunk) => {
//   console.log("chunk Data");
//   console.log(chunk);
//   buffer.push(chunk);
// });

// readStreamData.on("error", (err) => {
//   console.log("Get Error Data");
//   console.log(err);
// });

// readStreamData.on("end", () => {
//   console.log("End Data stream");
//   console.log(buffer.toString());
// });

//برای رایت کردن یک استرم
readStreamData.on("ready", () => {
  console.log("read Data stream");
});

readStreamData.on("data", (chunk) => {
  console.log("chunk Data");
  writeStreamData.write(chunk);
});

readStreamData.on("error", (err) => {
  console.log("Get Error Data");
  console.log(err);
});

readStreamData.on("end", () => {
  console.log("End Data stream");
});

readStreamData.on("finish", () => {
  console.log("finish write");
});
