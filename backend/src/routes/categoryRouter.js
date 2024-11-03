const categoryRouter = require('express').Router();

const { handleCreateCategory, handleGetCategories, handleSingleGetCategory, handleUpdateCategory, handleDeleteCategory } = require('../controllers/categoryController');
const { validateCategory } = require('../validations/category');
const runValidation = require("../validations");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");




categoryRouter.post('/', validateCategory, runValidation, isLoggedIn, isAdmin, handleCreateCategory);
categoryRouter.get('/', handleGetCategories);
categoryRouter.get('/:slug', handleSingleGetCategory);
categoryRouter.put('/:slug', validateCategory, runValidation, isLoggedIn, isAdmin, handleUpdateCategory);
categoryRouter.delete('/:slug', isLoggedIn, isAdmin, handleDeleteCategory);




module.exports = categoryRouter; 