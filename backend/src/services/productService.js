const  slugify  = require("slugify");
const createError = require('http-errors');
const  cloudinary  = require("../config/cloudinary");


const Product = require('../models/productModel');
const { publicIdWithoutExtensionFromUrl, deleteFileFromCloudinary } = require("../helper/cloudinaryHelper");




const createProduct = async (productData, image) =>{
    try {

        if(image && image.size > 1024 * 1024 * 2){
            throw createError(400, 'File too large. It must be less than 2 MB')
        }

        if(image) {
            const response = await cloudinary.uploader.upload(image, {folder: 'ecommerceMern/products', });
            productData.image = response.secure_url;
        }

        const productExists = await Product.exists({ name: productData.name});
        if(productExists) {
            throw createError(409, 'Product with this name already exits.')
        }

        // create product 
        const product = await Product.create({...productData, slug: slugify(productData.name)})

        return product;
    } catch (error) {
        throw error
    }
}

const getProducts = async (page = 1, limit = 4, filter = {}) =>{
    try {
        const products = await Product.find(filter)
        .populate('category')
        .skip((page - 1) * limit )
        .limit(limit)
        .sort({createdAt: -1 });

        if(!products){
            throw createError(404, 'Products not found')
        };

        const count = await Product.find(filter).countDocuments();

        return {
            products,
            count
        };
    } catch (error) {
        throw error;
    }
}

const getProduct = async (slug) =>{
    try {
        const product = await Product.findOne({slug})
        .populate('category');
        if(!product){
            throw createError(400, 'Product not found')
        }
        return product;
    } catch (error) {
        throw error
    }
}

const deleteProduct = async (slug) =>{
    try {
        const existingProduct = await Product.findOne({ slug });
        if(!existingProduct) {
            throw createError(404, 'No product found with this slug')
        };
        if(existingProduct.image){
            const publicId = await publicIdWithoutExtensionFromUrl(existingProduct.image);
            
            deleteFileFromCloudinary('ecommerceMern/products/', publicId, 'Product')
        }
        await Product.findOneAndDelete({ slug })
    } catch (error) {
        throw error;
    }
}

const updateProduct = async (slug, req) =>{
    try {
        const product = await Product.findOne({ slug: slug });
        if(!product){
            throw createError(404, 'Product not found')
        }
        const updatedOptions = {new: true, runValidators: true, context: 'query'};
        let updates = {};

        const allowedFields = ['name', 'description', 'price', 'quantity', 'sold', 'shipping'];

        for(const key in req.body){
            if(allowedFields.includes(key)){
                if(key === 'name'){
                    updates.slug = slugify(req.body[key]);
                }
                updates[key] = req.body[key];
            }
        }
        const image = req.file?.path;
        if(image){
            // image size maximum 2 mb
            if(image.size > 2097152){
                throw createError(400, "File too large. It must be less then 2 MB")
            }
            const response = await cloudinary.uploader.upload(image, {folder: 'ecommerceMern/products', });
            updates.image = response.secure_url;
        }

        const updatedProduct = await Product.findOneAndUpdate({ slug }, updates, updatedOptions);
        if(!updatedProduct){
            throw createError(404, 'Updating product was not possible')
        }

        // delete the previous product image from cloudinary
        if(product.image){
            const publicId = await publicIdWithoutExtensionFromUrl(product.image);
            await deleteFileFromCloudinary('ecommerceMern/products', publicId, 'Product');
        }

        return updatedProduct;
    } catch (error) {
        throw error;
    }
}



module.exports = {
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct,
}