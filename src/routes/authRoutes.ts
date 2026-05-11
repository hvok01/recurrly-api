import { Router } from "express";
import { signup, signin, signout } from "../controllers/auth.controller";

const authRouter = Router();

// POST sign up
authRouter.post("/signup", signup);

// POST sign in
authRouter.post("/signin", signin);

// POST sign out
authRouter.post("/signout", signout);

export default authRouter;