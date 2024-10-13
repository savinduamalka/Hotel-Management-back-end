import { createGalleryItems, deleteGalleryItemsbyName, getGalleryItems, updateGalleryItemsByName} from "../controllers/galleryItemsController.js";
import express from 'express';

const galleryItemsRoute = express.Router();

galleryItemsRoute.post("/", createGalleryItems);
galleryItemsRoute.get("/", getGalleryItems);
galleryItemsRoute.put("/:name", updateGalleryItemsByName);
galleryItemsRoute.delete("/:name", deleteGalleryItemsbyName);

export default galleryItemsRoute;
