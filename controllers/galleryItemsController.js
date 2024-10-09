import GalleryItems from "../models/galleryItems";
import express from express;

const galleryItemsController = express.Router();

export function getGalleryItems(req,res){
    const name=req.body.name;
    res.send("Get Request");
}

export function createGalleryItems(req,res){
    const galleryItem=req.body;
    
    const newGalleryItem = new GalleryItems(galleryItem); 

    newGalleryItem.save().then(
        ()=>{
            res.json({
                message:"Gallery Item created successfully"
            });
        }
    ).catch(
        (error)=>{
            res.status(400).json({
                message:"Gallery Item can't be created",
                error:error.message
            });
        }
    );
}