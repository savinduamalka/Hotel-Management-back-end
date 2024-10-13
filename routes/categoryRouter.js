import express from "express";
import {createCategory, deleteCategoryByName, getCategories, getCategoryByName, updateCategoryByName} from "../controllers/categoryController.js";


const categoryRouter = express.Router();

categoryRouter.get("/", getCategories);
categoryRouter.post("/", createCategory);
categoryRouter.put("/:name", updateCategoryByName);
categoryRouter.get("/:name", getCategoryByName);
categoryRouter.delete("/:name", deleteCategoryByName);


export default categoryRouter;