import Category from '../models/category.js';
import { checkAdmin } from './userController.js';

export function getCategories(req, res) {
    Category.find()
        .then((list) => {
            res.json({
                categories: list,
            });
        })
        .catch((error) => {
            res.status(500).json({
                message: "Categories can't be retrieved",
                error: error.message,
            });
        });
};

export function createCategory(req, res) {
    if(!checkAdmin(req)){
        res.status(403).json({
            message: "You are not allowed to create Category",
        });
        return;
    }

    const newCategory = new Category(req.body);

    newCategory.save()
        .then((result) => {
            res.status(201).json({
                message: "Category created successfully",
                result: result,
            });
        })
        .catch((error) => {
             res.status(400).json({
                message: "Category can't be created",
                error: error.message,
            });
        });
};

export function updateCategoryByName(req, res) {
    if(!checkAdmin(req)){
        res.status(403).json({
            message: "You are not allowed to update Category",
        });
        return;
    }

    const categoryName = req.params.name;
    const category = req.body;

    Category.findOneAndUpdate({name:categoryName}, category, {new:true})
        .then((result) => {
            res.json({
                message: "Category updated successfully",
                result: result,
            });
        })
        .catch((error) => {
            res.status(400).json({
                message: "Category can't be updated",
                error: error.message,
            });
        });
}

export function getCategoryByName(req,res){
    Category.findOne({name:req.params.name})
    .then(
        (result)=>{
            res.json({
                category:result
            })
        }
    ).catch(
        (err)=>{
            res.status(500).json({
                error:err.message
            })
        }
    )
}

export function deleteCategoryByName(req,res){
    if(!checkAdmin(req)){
        res.status(403).json({
            message: "You are not allowed to delete Category",
        });
    }
    Category.findOneAndDelete({name:req.params.name})
    .then(
        ()=>{
            res.json({
                message:"Category deleted successfully"
            })
        }
    ).catch(
        (err)=>{
            res.status(500).json({
                error:err.message
            })
        }
    )
}
