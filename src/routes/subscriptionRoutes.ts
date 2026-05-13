import express from "express";
import { addSubscription, getSubscriptions } from "../controllers/subscriptionController.ts";
import authorize from "../middleware/auth.middleware.ts";

const subscriptionRouter = express.Router();

subscriptionRouter.use(authorize);

subscriptionRouter.get("/", getSubscriptions);
subscriptionRouter.post("/", addSubscription);

export default subscriptionRouter;
