const { body } = require('express-validator');

const validateProduct = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Product Name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Product name should be at least 3-100 characters long'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ min: 3 })
        .withMessage('Description should be at least 3 characters long'),
    body('price')
        .trim()
        .notEmpty()
        .withMessage('Price is required')
        .isFloat({ min: 0 })
        .withMessage('Price must be a position number'),
    body('category')
        .trim()
        .notEmpty()
        .withMessage('Cateogry is required'),
    body('quantity')
        .trim()
        .notEmpty()
        .withMessage('Quantity is required')
        .isInt({ min: 1 })
        .withMessage('Quantity must be a position integer'),
    body('image')
        .optional()
        .isString()
        .withMessage("Product image is optional")
];

module.exports = {
    validateProduct,
}