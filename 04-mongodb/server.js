const { MongoClient } = require("mongodb");
const DB_URL = "mongodb://localhost:27017";
const DB_Name = "mongodb-tutorials";
const client = new MongoClient(DB_URL);

async function main() {
  await client.connect();
  console.log("connected to mongodb");
  const db = client.db(DB_Name);
  const userCollection = db.collection("user");
  const result = await userCollection.insertOne({
    firstName: "Moretza",
    lastName: "Pourrajab",
    age: 34,
    skills: ["ReactJs", "MongoDB", "NodeJs"],
    identity: "123456789",
    birthday: new Date("03-26-1991"),
    address: {
      province: "Gilan",
      city: "langroud",
      street: "azadi",
    },
  });
  console.log(result);
  userCollection
    .find({})
    .toArray()
    .then((res) => console.log(res));
}

main();
