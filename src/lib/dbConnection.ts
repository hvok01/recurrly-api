import mongoose from "mongoose";

export async function connectToDatabase() {

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined");
  }

  const db = (await mongoose.connect(process.env.MONGO_URI as string))
    .connection;

  db.on("error", console.error.bind(console, "connection error"));

  db.once("open", function () {
    console.log("Connected to db");
  });

  return db;
}
