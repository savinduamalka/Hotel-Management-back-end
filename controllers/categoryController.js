import Category from '../models/category.js';

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
    const user = req.user;
    if (!user) {
        res.status(403).json({
            message: "Please login to create category",
        });
        return;
    }
    if (user.payloader.type != 'admin') { 
        res.status(403).json({
            message: "You are not allowed to create category",
        });
        return;
    }

    const categoryData = req.body;

    const newCategory = new Category(categoryData);

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
