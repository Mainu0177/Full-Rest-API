const productRouter = require('express').Router();


const {
    handleCreateProduct,
    handleGetAllProducts,
    handleGetSingleProduct,
    handleDeleteProduct,
    handleUpdateProduct,
} = require('../controllers/productController');
const { uploadProductImage } = require('../middlewares/uploadFile');
const { validateProduct } = require('../validations/product');
const runValidation = require("../validations");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");




productRouter.post('/', uploadProductImage.single('image'),
    validateProduct,
    runValidation,
    isLoggedIn,
    isAdmin,
    handleCreateProduct,
);
productRouter.get('/', handleGetAllProducts);
productRouter.get('/:slug' , handleGetSingleProduct);
productRouter.delete('/:slug', isLoggedIn, isAdmin, handleDeleteProduct);
productRouter.put('/:slug', isLoggedIn, isAdmin,  uploadProductImage.single('image'), handleUpdateProduct);


module.exports = productRouter;