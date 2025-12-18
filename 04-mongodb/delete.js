const { MongoClient, ObjectId } = require("mongodb");
const DB_URL = "mongodb://localhost:27017";
const DB_Name = "mongodb-tutorials";
const client = new MongoClient(DB_URL);

async function main() {
  await client.connect();
  console.log("connected to mongodb");
  const db = client.db(DB_Name);
  const userCollection = db.collection("user");
  //   const result = await userCollection.deleteOne({firstName :"Moretza"});
  //   const result = await userCollection.deleteOne({
  //     _id: new ObjectId("67f3c1adb41fbd6232260530"),
  //   });
  //برای حذف آیدی از آبجکت آیدی استفاد میکنیم چون در دیتابیس بصورت آبجکت آیدی ذخیره میشود و باید در کدها نیز تبدیل به آبجکت آیدی شود

  // const result = await userCollection.findOneAndDelete({ firstName: "Moretza" });

  const result = await userCollection.deleteMany({ firstName: "Moretza" });

  console.log("deleted doc", result);
}

main();
