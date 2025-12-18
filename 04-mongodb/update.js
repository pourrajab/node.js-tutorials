const { MongoClient, ObjectId } = require("mongodb");
const DB_URL = "mongodb://localhost:27017";
const DB_Name = "mongodb-tutorials";
const client = new MongoClient(DB_URL);

async function main() {
  await client.connect();
  console.log("connected to mongodb");
  const db = client.db(DB_Name);
  const userCollection = db.collection("user");
  //   const result = await userCollection.updateOne(
  //     {
  //       _id: new ObjectId("67f3cadee19f815267415df7"),
  //     },
  //     { $set: { age: 25 } }
  //آپدیت را ست میکند
  //   );

  //   const result = await userCollection.updateOne(
  //     {
  //       _id: new ObjectId("67f3cadee19f815267415df7"),
  //     },
  //     { $push: { skills: "NestJs" } }
  //     //به آرایه اضافه می کند و پوش می کند
  //   );

  // const result = await userCollection.updateOne(
  //     {
  //       _id: new ObjectId("67f3cadee19f815267415df7"),
  //     },
  //     { $pull: { skills: "NestJs" } }
  //     //حذف می کند
  //   );

  // const result = await userCollection.updateOne(
  //     {
  //       _id: new ObjectId("67f3cadee19f815267415df7"),
  //     },
  //     { $inc: { age: 1 } }
  //     //به مواردی که دارای عدد هستن میتوان اضافه یا کم کرد مثلا در این حالت به سن یک سال اضافه می کند
  //   );

  //   const result = await userCollection.updateOne(
  //     {
  //       _id: new ObjectId("67f3cadee19f815267415df7"),
  //     },
  //     { $rename: { age: "userAge" } }
  //     //ویرایش نام فیلد
  //   );

  // const result = await userCollection.updateOne(
  //     {
  //       _id: new ObjectId("67f3cadee19f815267415df7"),
  //     },
  //     { $unset: { identity : 1 } }
  //     //حذف فیلد
  //   );

  // const result = await userCollection.updateMany(
  //     {
  //         firstName :"Moretza",
  //     },
  //     { $set: { age : "001" } }
  //     //اعمال روی همه دیتاها
  //   );

  const result = await userCollection.findOneAndUpdate(
    {
      firstName: "Moretza",
    },
    { $set: { age: 27 } }
    //اولین مورد را پیدا و آپدیت میکند
  );
  console.log("updated", result);
}

main();
