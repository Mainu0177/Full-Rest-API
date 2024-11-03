
const { successResponse } = require("../helper/responseController");

const {
    createCategory,
    getCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory
} = require('../services/categoryService');



const handleCreateCategory = async (req, res, next) =>{
    try {
        const {name} = req.body;
        const newCategory = await createCategory(name)

        successResponse(res,{
            statusCode: 201,
            message: 'Category was created successfully',
            payload: {
                newCategory,
            }
        })
    } catch (error) {
        next(error)
    }
}

const handleGetCategories = async (req, res, next) =>{
    try {
        findCategries = await getCategories();
        successResponse(res,{
            statusCode: 200,
            message: 'Categories fetched successfully',
            payload: {
                findCategries,
            }
        })
    } catch (error) {
        next(error)
    }
}

const handleSingleGetCategory = async (req, res, next) =>{
    try {
        const {slug} = req.params;
        const findCategory = await getSingleCategory(slug);
        successResponse(res,{
            statusCode: 200,
            message: 'Single Category fetched successfully',
            payload: {
                findCategory,
            }
        })
    } catch (error) {
        next(error)
    }
}

const handleUpdateCategory = async (req, res, next) =>{
    try {
        const { name } = req.body;
        const { slug } = req.params;
        
        const updatedCategory = await updateCategory(name, slug);

        successResponse(res,{
            statusCode: 200,
            message: 'Category was updated successfully',
            payload: {
                updatedCategory
            }
        })
    } catch (error) {
        next(error)
    }
}

const handleDeleteCategory = async (req, res, next) =>{
    try {
        const { slug } = req.params;
        const deletedCategory = await deleteCategory(slug);
        if(!deletedCategory){
            throw createError(404, 'No category found')
        }
        successResponse(res,{
            statusCode: 200,
            message: 'Category was deleted successfully',
            payload: {
                deletedCategory
            }
        })
    } catch (error) {
        next (error)
    }
}

module.exports = {
    handleCreateCategory,
    handleGetCategories,
    handleSingleGetCategory,
    handleUpdateCategory,
    handleDeleteCategory
}