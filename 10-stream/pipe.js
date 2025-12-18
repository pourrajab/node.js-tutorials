const fs = require("fs");
const http = require("http");
// const readStreamData = fs.createReadStream("./file.txt");
// const writeStreamData = fs.createWriteStream("./write-pipe.txt");

// readStreamData.pipe(writeStreamData);

http
  .createServer((req, res) => {
    const readStreamData = fs.createReadStream("./file.txt");
    res.writeHead(200, { "Content-type": "text/plan" });
    readStreamData.pipe(res);
  })
  .listen(3000);
console.log("listen to port 3000 : http://localhost:3000");

//از طریق پایپ می توان مستقیم رایت کرد و در اینجا از طریق راه اندازی سرور مستقیم در ادرس و روت دلخواه رایت شده است