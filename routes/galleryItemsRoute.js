import { createGalleryItems} from "../controllers/galleryItemsController.js";
import express from 'express';

const galleryItemsRoute = express.Router();

galleryItemsRoute.post("/", createGalleryItems);

export default galleryItemsRoute;
