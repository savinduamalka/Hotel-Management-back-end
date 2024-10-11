import express from "express";
import {createCategory, getCategories} from "../controllers/categoryController.js";

const categoryRouter = express.Router();

categoryRouter.get("/", getCategories);
categoryRouter.post("/", createCategory);


export default categoryRouter;