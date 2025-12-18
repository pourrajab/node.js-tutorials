const { MongoClient, ObjectId } = require("mongodb");
const DB_URL = "mongodb://localhost:27017";
const DB_Name = "mongodb-tutorials";
const client = new MongoClient(DB_URL);

async function main() {
  await client.connect();
  console.log("connected to mongodb");
  const db = client.db(DB_Name);
  const userCollection = db.collection("user");
  const result = await userCollection
    .aggregate([
      {
        $match: {
          firstName: "Borna",
        },
      },
      {
        $project: {
          age: 0,
        },
      },
      {
        $addFields: {
          "userAge": 20,
        },
      },
    ])
    .toArray();
  console.log(result);
}

main();
