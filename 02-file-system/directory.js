const fs = require("fs");
const folderAddress = "new-dir";
const checkExist = fs.existsSync(folderAddress);

// if(checkExist){
//     console.log("this folder already exist");
// }else {
//     fs.mkdir(folderAddress,(err) => {
//         if(err) console.log(err);
//     })
// }

// mkdir : ایجاد دایرکتوری
// recursive : در صورت موجود بودن پوشه خطا نمی دهد
fs.mkdir(folderAddress, { recursive: true }, (err) => {
  if (err) console.log(err);
});

fs.mkdirSync("new-dir1", { recursive: true });
//--------------------
fs.readdir("./", (err, files) => {
  console.log(files);
});
