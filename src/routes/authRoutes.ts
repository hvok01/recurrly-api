import express from "express";
import { signup, signin, signout } from "../controllers/auth.controller.ts";

const authRouter = express.Router();

// POST sign up
authRouter.post("/signup", signup);

// POST sign in
authRouter.post("/signin", signin);

// POST sign out
authRouter.post("/signout", signout);

export default authRouter;