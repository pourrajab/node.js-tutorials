const http = require("http");
const fs = require("fs");
const path = require("path");
const { randomInt } = require("crypto");

const PORT = 3000;
const DATA_FILE = path.join(__dirname, "todos.json");

// تابع خواندن تودوها از فایل (کاملاً ایمن)
function readTodos() {
  try {
    // اگر فایل وجود ندارد
    if (!fs.existsSync(DATA_FILE)) {
      console.log("فایل todos.json وجود ندارد. آرایه خالی برمی‌گردد.");
      return [];
    }

    // خواندن محتوای فایل
    const data = fs.readFileSync(DATA_FILE, "utf-8").trim();

    // اگر فایل خالی بود
    if (data === "") {
      console.log("فایل todos.json خالی است. آرایه خالی برمی‌گردد.");
      return [];
    }

    // تلاش برای پارس JSON
    const parsed = JSON.parse(data);

    // مطمئن شو که یک آرایه است
    if (Array.isArray(parsed)) {
      return parsed;
    } else {
      console.warn("محتوای todos.json آرایه نیست. آرایه خالی برمی‌گردد.");
      return [];
    }
  } catch (err) {
    console.error("خطا در خواندن یا پارس فایل todos.json:", err.message);
    console.log("آرایه خالی برمی‌گردانیم تا سرور ادامه دهد.");
    return [];
  }
}

// تابع ذخیره تودوها در فایل (با مدیریت خطا)
function writeTodos(todos) {
  try {
    // ذخیره با فرمت زیبا (indent 2)
    fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2), "utf-8");
    console.log("تودوها با موفقیت در فایل ذخیره شدند.");
  } catch (err) {
    console.error("خطا در نوشتن در فایل todos.json:", err.message);
  }
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
      try {
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
          id: randomInt(100000, 999999),
          text: text.trim(),
          completed: false,
          createdAt: new Date().toISOString(),
        };

        todos.push(newTodo);
        writeTodos(todos);

        res.writeHead(201, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(JSON.stringify(newTodo));
      } catch (err) {
        res.writeHead(400, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(JSON.stringify({ error: "داده نامعتبر است" }));
      }
    });
    return;
  }

  // PUT /todos/:id → ویرایش متن یا وضعیت تکمیل
  if (req.method === "PUT" && path.startsWith("/todos/")) {
    const id = parseInt(path.split("/")[2], 10);

    if (isNaN(id)) {
      res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: "آیدی نامعتبر است" }));
      return;
    }

    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const updates = JSON.parse(body);
        const todos = readTodos();
        const todoIndex = todos.findIndex((t) => t.id === id);

        if (todoIndex === -1) {
          res.writeHead(404, {
            "Content-Type": "application/json; charset=utf-8",
          });
          res.end(JSON.stringify({ error: "وظیفه یافت نشد" }));
          return;
        }

        if (updates.text !== undefined) {
          if (typeof updates.text !== "string" || updates.text.trim() === "") {
            res.writeHead(400, {
              "Content-Type": "application/json; charset=utf-8",
            });
            res.end(JSON.stringify({ error: "متن وظیفه نامعتبر است" }));
            return;
          }
          todos[todoIndex].text = updates.text.trim();
        }
        if (updates.completed !== undefined) {
          todos[todoIndex].completed = Boolean(updates.completed);
        }

        writeTodos(todos);

        res.writeHead(200, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(JSON.stringify(todos[todoIndex]));
      } catch (err) {
        res.writeHead(400, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(JSON.stringify({ error: "داده نامعتبر است" }));
      }
    });
    return;
  }

  // DELETE /todos/:id → حذف وظیفه
  if (req.method === "DELETE" && path.startsWith("/todos/")) {
    const id = parseInt(path.split("/")[2], 10);

    if (isNaN(id)) {
      res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: "آیدی نامعتبر است" }));
      return;
    }

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
  console.log(`داده‌ها در فایل: ${DATA_FILE}`);
});
