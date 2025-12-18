const { MongoClient, ObjectId } = require("mongodb");
const DB_URL = "mongodb://localhost:27017";
const DB_Name = "mongodb-tutorials";
const client = new MongoClient(DB_URL);

async function main() {
  await client.connect();
  console.log("connected to mongodb");
  const db = client.db(DB_Name);
  const userCollection = db.collection("user");
//   const users = await userCollection.find({ lastName: "Pourrajab" }).toArray();
//   const users = await userCollection.find({ "address.city": "Tehran" }).toArray();
//   const users = await userCollection.find({ birthday: {$lte : new Date("03-26-1991")} }).toArray();
  //$lte: کمتر مساوی است -$lte: کوچکتر مساوی (کاربران مسن‌تر)

//   const users = await userCollection.find({ birthday: {$gte : new Date("03-26-1991")} }).toArray();
  //$gte: بزرگتر مساوی (کاربران جوان‌تر)

  const users = await userCollection.find({ "address.city": {$in: ["azadi"]} }).toArray();
  // این عملگر آرایه ای از شهرهایی که می دهیم را نشان می دهد

  console.log("users", users);
}

main();


//در MongoDB عملگرهای مقایسه و فیلترینگ متنوعی وجود دارد:
// مقایسه عددی:
// $eq: برابر با
// $ne: نامساوی
// $gt: بزرگتر
// $gte: بزرگتر مساوی
// $lt: کوچکتر
// $lte: کوچکتر مساوی
// جستجوی چندگانه:

// $in: موجود در لیست
// $nin: موجود نبودن در لیست
// عملگرهای منطقی:

// $and: و
// $or: یا
// $not: نقیض
// $nor: نه این و نه آن
// عملگرهای آرایه:

// $all: همه مقادیر
// $elemMatch: تطبیق اجزای آرایه