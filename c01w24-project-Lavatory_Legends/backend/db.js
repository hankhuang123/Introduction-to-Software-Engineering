import { MongoClient } from "mongodb";
const mongoURL = "mongodb://localhost:27017";
// const mongoURL = "mongodb+srv://vivianxyliang:MPhbmtFjP3vc46pB@cluster0.nwntktt.mongodb.net/?retryWrites=true&w=majority";
const dbName = "GoHereDB";
// Connect to MongoDB
let db;
async function connectToMongo() {
  const client = new MongoClient(mongoURL);
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    db = client.db(dbName);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

export { connectToMongo, db };