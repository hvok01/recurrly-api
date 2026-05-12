import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { connectToDatabase } from "./lib/dbConnection.ts";
import authRouter from "./routes/authRoutes.ts";
import { clerkMiddleware } from '@clerk/express'
import subscriptionRouter from "./routes/subscriptionRoutes.ts";
import cookieParser from 'cookie-parser';
import cors from "cors";

const parseCsvEnv = (value: any) =>
  value
    ?.split(",")
    .map((entry: string) => entry.trim())
    .filter(Boolean) || [];

async function start() {
  dotenv.config({
    path: "./.env",
  });

  const allowedOrigins = parseCsvEnv(process.env.CORS_ORIGINS);
  const authorizedParties = parseCsvEnv(process.env.CLERK_AUTHORIZED_PARTIES);
  const clerkOptions: any = {};

  if (authorizedParties.length) {
    clerkOptions.authorizedParties = authorizedParties;
  }

  await connectToDatabase();

  const app = express();

  app.use(bodyParser.json());
  
  app.use(clerkMiddleware(clerkOptions))
  app.use(
    cors({
      origin: allowedOrigins.length
        ? (origin: any, callback: any) => callback(null, !origin || allowedOrigins.includes(origin))
        : true,
      allowedHeaders: ["Authorization", "Content-Type"],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    })
  );
  app.use(cookieParser());

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/subscriptions", subscriptionRouter)

  app.listen(process.env.HTTP_PORT, () => {
    console.log(`Server is running on port ${process.env.HTTP_PORT}`);
  });
}

start();
