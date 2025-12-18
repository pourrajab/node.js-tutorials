const { MongoClient, ObjectId } = require("mongodb");
const DB_URL = "mongodb://localhost:27017";
const DB_Name = "mongodb-tutorials";
const client = new MongoClient(DB_URL);

async function main() {
  await client.connect();
  console.log("connected to mongodb");
  const db = client.db(DB_Name);
  const userCollection = db.collection("user");

  //   const users = await userCollection.findOne(
  //     {
  //       _id: new ObjectId("67f3cadee19f815267415df7"),
  //     },
  //     {
  //       projection: {
  //         age: 0,
  //         birthday: 0,
  //         //یعنی مقدار سن و تولد را در خروجی نشان نده
  //         //اگر firstName:1 قرار دهیم فقط نام را نشان میدهد
  //       },
  //     }
  //   );

  //   const users = await userCollection.findOne(
  //     {
  //       _id: new ObjectId("67f3cadee19f815267415df7"),
  //     },
  //     {
  //       projection: {
  //         firstName: 1,
  //         //اگر fisrtName:1 قرار دهیم فقط نام را نشان میدهد
  //       },
  //     }
  //   );

  //   const users = await userCollection
  //     .find(
  //       {},
  //       {
  //         limit: 1,
  //         //فقط یک مقدار را برمیگرداند
  //       }
  //     )
  //     .toArray();

  const users = await userCollection
    .find(
      {},
      {
        sort: { _id: -1 },
        //مقادیر را سورت میکند
      }
    )
    .toArray();
  console.log("users", users);
}

main();
