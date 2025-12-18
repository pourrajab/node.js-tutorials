const { ObjectId } = require("mongodb");
const ConnectToMongoDb = require("../utils/mongo-connection");
const productCollection = "product";
async function find() {
  const db = await new ConnectToMongoDb().Get();
  return new Promise(async (resolve, reject) => {
    const products = await db
      .collection(productCollection)
      .find({}, { sort: { _id: -1 } })
      .toArray();

    resolve(products);
  });
}

async function findById(id) {
  const db = await new ConnectToMongoDb().Get();

  return new Promise(async (resolve, reject) => {
    const product = await db
      .collection(productCollection)
      .findOne({ _id: new ObjectId(id) })
      .toArray();
    resolve(product);
  });
}

async function create(product) {
  const db = await new ConnectToMongoDb().Get();

  return new Promise(async (resolve, reject) => {
    const result = await db.collection(productCollection).insertOne(product);

    resolve(result);
  });
}

async function update(id, payload) {
  const db = await new ConnectToMongoDb().Get();
  const id = new ObjectId();
  return new Promise(async (resolve, reject) => {
    const result = await db
      .collection(productCollection)
      .updateOne({ _id: new ObjectId(id) }, { $set: { ...payload } });

    resolve(result);
  });
}

async function remove(id) {
  const db = await new ConnectToMongoDb().Get();

  return new Promise(async (resolve, reject) => {
    const result = await db
      .collection(productCollection)
      .deleteOne({ _id: new ObjectId(id) });

    resolve(result);
  });
}

const ProductsModel = {
  find,
  findById,
  create,
  update,
  remove,
};

module.exports = ProductsModel;
