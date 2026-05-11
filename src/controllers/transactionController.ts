import express from "express";
import { httpResponse } from "../lib/httpResponse.ts";
import transaction from "../models/transaction.ts";
import User from "../models/user.ts";
import Transaction from "../models/transaction.ts";

export const getTransaction = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const transactions = await transaction.find().limit(10);

    return httpResponse(
      200,
      "Transactions retreived successsfully",
      {
        transactions: transactions.map((transactionDoc) => {
          return {
            id: transactionDoc._id,
            description: transactionDoc.description,
          };
        }),
      },
      res
    );
  } catch (error) {
    return httpResponse(500, "Internal server error", {}, res);
  }
};

export const addTransaction = async (
  req: express.Request & {
    body: {
      description: string;
    };
  },
  res: express.Response
) => {
  try {
    const { description } = req.body;

    if (!description) {
      return httpResponse(400, "Missing required description", {}, res);
    }

    const transactionDoc = new Transaction({
      description,
    });

    await transactionDoc.save();

    return httpResponse(
      201,
      "Transaction created successfully",
      {
        transaction: {
          id: transactionDoc._id,
          description: transactionDoc.description,
        },
      },
      res
    );
  } catch (error) {
    return httpResponse(500, "Internal server error", {}, res);
  }
};
