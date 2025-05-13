import GalleryItems from "../models/galleryItems.js";
import { checkAdmin } from "./userController.js";

export function getGalleryItems(req, res) {
  // Pagination logic
  const page = parseInt(req.query.page, 10) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  Promise.all([
    GalleryItems.find().skip(skip).limit(limit),
    GalleryItems.countDocuments()
  ])
    .then(([list, total]) => {
      res.json({
        galleryItems: list,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      });
    })
    .catch((error) => {
      res.json({
        message: "Gallery Item can't be retrieved",
        error: error.message,
      });
    });
}

export function createGalleryItems(req, res) {
  if(!checkAdmin(req)){
    res.status(403).json({
      message: "You are not allowed to create Gallery Item",
    });
    return;
  }
  
  const galleryItem = req.body;

  const newGalleryItem = new GalleryItems(galleryItem);

  newGalleryItem.save()
    .then((result) => {
      res.json({
        message: "Gallery Item created successfully",
        galleryItem: result
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: "Gallery Item can't be created",
        error: error
      });
    });
}

export function updateGalleryItemsByName(req, res) {
  if(!checkAdmin(req)){
    res.status(403).json({
      message: "You are not allowed to update Gallery Item",
    });
    return;
  }
  const galleryName = req.params.name;
  const galleryItem = req.body;
  GalleryItems.findOneAndUpdate({ name: galleryName }, galleryItem, { new: true })
    .then((result) => {
      res.json({
        message: "Gallery Item updated successfully",
        galleryItem: result
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: "Gallery Item can't be updated",
        error: error
      });
    });
}

export function deleteGalleryItemsbyName(req, res) {
  if(!checkAdmin(req)){
    res.status(403).json({
      message: "You are not allowed to delete Gallery Item",
    });
    return;
  }
  const galleryName = req.params.name;
  GalleryItems.deleteOne({ name: galleryName })
    .then((result) => {
      res.json({
        message: "Gallery Item deleted successfully",
        galleryItem: result
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: "Gallery Item can't be deleted",
        error: error
      });
    });
}
