import express from "express";
import {
  addTransaction,
  getTransaction,
} from "../controllers/transactionController.ts";

const transactionRouter = express.Router();

transactionRouter.get("/", getTransaction);

transactionRouter.post("/", addTransaction);

export default transactionRouter;
