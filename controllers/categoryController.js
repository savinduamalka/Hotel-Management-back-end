import Category from '../models/category.js';

export function getCategories(req, res) {
    const category = req.body.name;
    Category.find()
        .then((list) => {
            res.json({
                categories: list,
            });
        })
        .catch((error) => {
            res.json({
                message: "Category can't be retrieved",
                error: error.message,
            });
        });
};

export function createCategory(req, res) {
    const user = req.user;
    if (user == null) {
        res.status(403).json({
            message: "Please login to create category",
        });
        return;
    }

    const category = req.body;

    const newCategory = new Category(category);

    newCategory
        .save()
        .then(() => {
            res.json({
                message: "Category created successfully",
            });
        })
        .catch((error) => {
            res.status(400).json({
                message: "Category can't be created",
                error: error.message,
            });
        });
}
