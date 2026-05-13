import express from "express";
import { addSubscription, getSubscriptionsPaged } from "../controllers/subscriptionController.ts";
import authorize from "../middleware/auth.middleware.ts";

const subscriptionRouter = express.Router();

subscriptionRouter.use(authorize);

subscriptionRouter.get("/", getSubscriptionsPaged);
subscriptionRouter.post("/", addSubscription);

export default subscriptionRouter;
