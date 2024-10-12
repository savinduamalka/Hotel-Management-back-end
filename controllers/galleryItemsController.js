import GalleryItems from "../models/galleryItems.js";

export function getGalleryItems(req, res) {

  GalleryItems.find()
    .then((list) => {
      res.json({
        galleryItems: list,
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
  const user = req.user;
  if (user == null) {
     res.status(403).json({
      message: "Please login to create gallery item",
    });
    return;
  }
  if(user.payloader.type!='admin'){
    res.status(403).json({
      message: "You are not allowed to create gallery item",
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
