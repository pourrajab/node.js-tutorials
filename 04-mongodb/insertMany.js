const { MongoClient } = require("mongodb");
const DB_URL = "mongodb://localhost:27017";
const DB_Name = "mongodb-tutorials";
const client = new MongoClient(DB_URL);

async function main() {
  await client.connect();
  console.log("connected to mongodb");
  const db = client.db(DB_Name);
  const userCollection = db.collection("user");
  const result = await userCollection.insertMany([
    {
      firstName: "Borna",
      lastName: "Golsha",
      age: 34,
      skills: ["ReactJs", , "NodeJs"],
      identity: "123456789",
      birthday: new Date("03-26-1991"),
      address: {
        province: "Gilan",
        city: "langroud",
        Street: "azadi",
      },
    },
    {
      firstName: "Dana",
      lastName: "Ghazi",
      age: 34,
      skills: ["ReactJs", "MongoDB", "NodeJs"],
      identity: "123456789",
      birthday: new Date("03-26-1991"),
      address: {
        province: "Tehran",
        city: "Tehran",
        Street: "azadi",
      },
    },
    {
      firstName: "Behesht",
      lastName: "nazbaba",
      age: 34,
      skills: ["Fullstack", "MongoDB", "NodeJs"],
      identity: "123456789",
      birthday: new Date("03-26-1991"),
      address: {
        province: "Gilan",
        city: "langroud",
        Street: "azadi",
      },
    },
  ]);
  console.log("InsertDuc", result);
  userCollection.countDocuments({}).then((count) => console.log(count));
  userCollection
    .countDocuments({})
    .then((countDocuments) => console.log(countDocuments));
    //تعداد داکیومنت های ذخیره شذه داخل داکیومنت را نشان می دهد
}

main();
