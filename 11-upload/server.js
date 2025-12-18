const { createReadStream, statSync } = require("fs");
const http = require("http");

const fileName = "video.mp4";
http
  .createServer(async (req, res) => {
    const readStream = createReadStream(fileName);
    const { size } = statSync(fileName);
    const range = req.headers.range;
    if (range) {
      let [start, end] = range.replace(/bytes=/, "").split("-");
      start = parseInt(start, 10);
      end = end ? parseInt(end, 10) : size - 1;
      res.writeHead(206, {
        "Content-Range": `bytes ${start} - ${end} / ${size}`,
        "Accept-Range": "bytes",
        "Content-Length": start - end + 1,
        "Content-type": "video/mp4",
      });
      createReadStream(fileName, { start, end }).pipe(res);
    } else {
      res.writeHead(200, {
        "Content-type": "video/mp4",
        "Content-Length": size,
      });
      readStream.pipe(res);
    }
  })
  .listen(3000);
console.log("listen to port 3000 : http://localhost:3000");

//راه اندازی استریم یک ویدئو از بک اند به فرانت
