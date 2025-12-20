const http = require("http");
const fs = require("fs");
const path = require("path");
const { randomInt } = require("crypto");

const PORT = 3000;
const DATA_FILE = path.join(__dirname, "todos.json");

// اطمینان از وجود فایل داده (اگر نباشه، یکی خالی می‌سازیم)
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]", "utf-8");
}

// تابع خواندن تودوها از فایل
function readTodos() {
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

// تابع ذخیره تودوها در فایل
function writeTodos(todos) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2), "utf-8");
}

const server = http.createServer((req, res) => {
  // CORS برای دسترسی از فرانت‌اند
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const path = urlObj.pathname;

  // GET /todos → لیست همه تودوها
  if (req.method === "GET" && path === "/todos") {
    const todos = readTodos();
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(todos));
    return;
  }

  // POST /todos → اضافه کردن تودوی جدید
  if (req.method === "POST" && path === "/todos") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const { text } = JSON.parse(body);
      if (!text || text.trim() === "") {
        res.writeHead(400, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(JSON.stringify({ error: "متن وظیفه الزامی است" }));
        return;
      }

      const todos = readTodos();
      const newTodo = {
        id: randomInt(100000, 999999), // آی‌دی منحصر به فرد
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      todos.push(newTodo);
      writeTodos(todos);

      res.writeHead(201, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify(newTodo));
    });
    return;
  }

  // PUT /todos/:id → ویرایش یا تغییر وضعیت کامل شدن
  if (req.method === "PUT" && path.startsWith("/todos/")) {
    const id = parseInt(path.split("/")[2]);
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const updates = JSON.parse(body);
      const todos = readTodos();
      const todo = todos.find((t) => t.id === id);

      if (!todo) {
        res.writeHead(404, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(JSON.stringify({ error: "وظیفه یافت نشد" }));
        return;
      }

      if (updates.text !== undefined) todo.text = updates.text.trim();
      if (updates.completed !== undefined) todo.completed = updates.completed;

      writeTodos(todos);

      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify(todo));
    });
    return;
  }

  // DELETE /todos/:id → حذف وظیفه
  if (req.method === "DELETE" && path.startsWith("/todos/")) {
    const id = parseInt(path.split("/")[2]);
    const todos = readTodos();
    const index = todos.findIndex((t) => t.id === id);

    if (index === -1) {
      res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: "وظیفه یافت نشد" }));
      return;
    }

    todos.splice(index, 1);
    writeTodos(todos);

    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ message: "وظیفه با موفقیت حذف شد" }));
    return;
  }

  // مسیر نامعتبر
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("مسیر یافت نشد");
});

server.listen(PORT, () => {
  console.log(`سرور TODO API در حال اجرا روی http://localhost:${PORT}`);
});
