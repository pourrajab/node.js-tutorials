const ProductsModel = require("../model/product.model");

async function get(req, res) {
  try {
    const products = await ProductsModel.find();
    res.writeHead(200, { "Constant-Type": "application/json" });
    res.write(JSON.stringify(products));

    res.end();
  } catch (error) {
    console.log(error);
  }
}

async function getById(req, res) {
  try {
    // const [, , , id] = req.url.split("/");
    const id = req.url.split("/")[3];

    const product = await ProductsModel.findById(id);
    if (!product) {
      res.writeHead(404, { "Constant-Type": "application/json" });
      res.write(JSON.stringify({ message: " not found any product" }));

      res.end();
    } else {
      res.writeHead(200, { "Constant-Type": "application/json" });
      res.write(JSON.stringify(product));

      res.end();
    }
  } catch (error) {
    console.log(error);
  }
}

async function create(req, res) {
  try {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      const product = { ...JSON.parse(body), createdAt: new Date() };
      const result = await ProductsModel.create(product);
      res.writeHead(201, { "Constant-Type": "application/json" });
      res.write(JSON.stringify(result));

      res.end();
    });
  } catch (error) {
    console.log(error);
  }
}

async function update(req, res) {
  try {
    let body = "";
    const id = req.url.split("/")[3];
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      const parsedBudy = { ...JSON.parse(body) };
      const product = await ProductsModel.findById(id);
      if (!product) {
        res.writeHead(404, { "Constant-Type": "application/json" });
        res.write(JSON.stringify({ message: " not found any product" }));

        res.end();
      } else {
        const result = await ProductsModel.update(id, parsedBudy);
        res.writeHead(200, { "Constant-Type": "application/json" });
        res.write(JSON.stringify(result));

        res.end();
      }
    });
  } catch (error) {
    console.log(error);
  }
}

async function remove(req, res) {
  try {
    // const [, , , id] = req.url.split("/");
    const id = req.url.split("/")[3];

    const product = await ProductsModel.findById(id);
    if (!product) {
      res.writeHead(404, { "Constant-Type": "application/json" });
      res.write(JSON.stringify({ message: " not found any product" }));

      res.end();
    } else {
      const result = await ProductsModel.remove(id);
      res.writeHead(200, { "Constant-Type": "application/json" });
      res.write(JSON.stringify(result));

      res.end();
    }
  } catch (error) {
    console.log(error);
  }
}

const ProductsController = {
  get,
  getById,
  create,
  update,
  remove,
};

module.exports = ProductsController;
