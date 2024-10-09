import { createGalleryItems, getGalleryItems} from "../controllers/galleryItemsController.js";
import express from 'express';

const galleryItemsRoute = express.Router();

galleryItemsRoute.post("/", createGalleryItems);
galleryItemsRoute.get("/", getGalleryItems);

export default galleryItemsRoute;
