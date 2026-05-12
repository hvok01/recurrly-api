import express from "express";
import { addSubscription } from "../controllers/subscriptionController.ts";
import authorize from "../middleware/auth.middleware.ts";

const subscriptionRouter = express.Router();

subscriptionRouter.use(authorize);

subscriptionRouter.post("/", addSubscription);

export default subscriptionRouter;
