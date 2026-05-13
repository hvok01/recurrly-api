import express from "express";
import authorize from "../middleware/auth.middleware.ts";
import { getCategoriesPaged, addCategory, updateCateogory } from "../controllers/category.controller.ts";

const categoryRouter = express.Router();

categoryRouter.use(authorize);

categoryRouter.get("/", getCategoriesPaged);
categoryRouter.post("/", addCategory);
categoryRouter.put("/", updateCateogory);

export default categoryRouter;
