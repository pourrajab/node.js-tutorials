const http = require("http");
const { json } = require("stream/consumers");

//ایجاد سرور
http
  .createServer(function (request, response) {
    console.log(request);
    //انواع Content-Type های متداول
    // response.writeHead(200, { "Content-Type": "text/plain" });
    // response.writeHead(200, { "Content-Type": "text/html" });
    response.writeHead(200, { "Content-Type": "application/json" });

    // response.end("Hello Nodejs");
    // response.end("<h1>Hello Nodejs</h1>");
    response.end(
      JSON.stringify({ name: "Nodes", course: "Nodejs and express" })
    );
  })
  .listen(3000, () => {
    console.log("server run on port 3000 :  http://localhost:3000");
  });
