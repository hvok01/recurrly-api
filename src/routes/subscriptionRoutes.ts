import express from "express";
import { addSubscription, getSubscriptionsPaged, getSubscriptionsBalance } from "../controllers/subscriptionController.ts";
import authorize from "../middleware/auth.middleware.ts";

const subscriptionRouter = express.Router();

subscriptionRouter.use(authorize);

subscriptionRouter.get("/", getSubscriptionsPaged);
subscriptionRouter.post("/", addSubscription);
subscriptionRouter.get("/balance", getSubscriptionsBalance);

export default subscriptionRouter;
