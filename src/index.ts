import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { connectToDatabase } from "./lib/dbConnection.ts";
import { clerkClient } from "@clerk/express";
import authRouter from "./routes/authRoutes.ts";
// import transactionRouter from "./routes/transactionsRoutes.ts";
import { clerkMiddleware } from '@clerk/express'

async function start() {
  dotenv.config({
    path: "./.env",
  });

  // const userList = await clerkClient.users.getUserList();
  // console.log("user list: ", userList);

  // await connectToDatabase();

  const app = express();

  app.use(bodyParser.json());
  
  app.use(clerkMiddleware())

  // app.use("/api/transaction", transactionRouter);
  app.use("/api/v1/auth", authRouter);

  app.listen(process.env.HTTP_PORT, () => {
    console.log(`Server is running on port ${process.env.HTTP_PORT}`);
  });
}

start();
