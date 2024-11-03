const { default: slugify } = require("slugify");
const Category = require("../models/categoryModel");
const createError = require("http-errors");



const createCategory = async (name) =>{
    try {
        const newCategory = await Category.create({
            name: name,
            slug: slugify(name),
        })
        return newCategory;
    } catch (error) {
        throw error;
    }
}

const getCategories = async () =>{
    try {
        const findCategories = await Category.find({}).select('name slug').lean();
        return findCategories;
    } catch (error) {
        throw error;
    }
}

const getSingleCategory = async (slug) =>{
    try {
        const findCategory = await Category.find({ slug }).select('name slug').lean();
        return findCategory;
    } catch (error) {
        throw error;
    }
}

const updateCategory = async (slug, name) =>{
    try {
        const filter = { slug };
        const updates = {$set: {name: name, slug: slugify(name)}};
        const option = {new: true}
        const updatedCategory = await Category.findOneAndUpdate(filter, updates, option);
        if(!updatedCategory){
            throw createError(404, 'No category found with this slug')
        }
        return updatedCategory;
    } catch (error) {
        throw error;
    }
}

const deleteCategory = async (slug) =>{
    try {
        const deletedCategory = await Category.findOneAndDelete({slug})
        return deletedCategory;
    } catch (error) {
        throw error
    }
}

module.exports = {
    createCategory,
    getCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory
}