const fs = require("fs");
// appendFile : فایلی را به انتهای یک فایل دیگر اضافه می کند
// fs.appendFile("write.txt", "new data appended", "utf8", (err) => {
//     console.log(err);
// })

// fs.appendFileSync("write.txt", "\nnew data appended with sync", "utf8");

// existsSync : بررسی می کند فایل وجود دارد یا خیر
const checkExist = fs.existsSync("file.txt");
if (checkExist) {
  console.log(checkExist);
  // unlink : فایل را حذف می کند
  // fs.unlink("file.txt", (err) => {
  //     if(err) console.log(err);
  // })

  fs.unlinkSync("file.txt");
} else {
  console.log("not found file");
}
