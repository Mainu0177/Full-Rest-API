
const { successResponse } = require("../helper/responseController");
const { createProduct, getProducts, getProduct, deleteProduct, updateProduct } = require("../services/productService");


const handleCreateProduct = async (req, res, next) =>{
    try {  
        const image = req.file?.path;
        const product = await createProduct(req.body, image)

        return successResponse(res,{
            statusCode: 200,
            message: 'Product was created successfully',
            payload: {
                product,
            }
        })
    } catch (error) {
        next(error)
    }
}

const handleGetAllProducts = async (req, res, next) =>{
    try {
        const search = req.query.search || '';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;

        const searchRegExp = new RegExp('.*' + search + '.*', 'i');
        const filter = {
            // isAdmin: {$ne: true },
            $or:[
                {name: {$regex: searchRegExp}},
                // {email: {$regex: searchRegExp}},
                // {phone: {$regex: searchRegExp}},
            ],
        };

        const getProductsData = await getProducts(page, limit, filter)

        successResponse(res,{
            statusCode: 200,
            message: 'Returned all the products',
            payload: {
                products: getProductsData.products,
                pagination: {
                    totalPages: Math.ceil(getProductsData.count / limit),
                    currentPage: page,
                    previousPage: page - 1,
                    nextPage: page + 1,
                    totalNumberOfProducts: getProductsData.count
                }
            }
        })
    } catch (error) {
        next(error)
    }
}

const handleGetSingleProduct = async (req, res, next) =>{
    try {
        const { slug } = req.params;
        const productData = await getProduct(slug)

        successResponse(res,{
            statusCode: 200,
            message: 'Returned a single product',
            payload: {  
                productData
            }
        })
    } catch (error) {
        next(error)
    }
}

const handleDeleteProduct = async (req, res, next) =>{
    try {
        const { slug } = req.params;
        const product = await deleteProduct(slug);
        successResponse(res,{
            statusCode: 200,
            message: 'Product deleted successfully',
            payload: {
                product
            }
        })
    } catch (error) {
        next(error)
    }
}

const handleUpdateProduct = async (req, res, next) =>{
    try {
        const { slug } = req.params;
        const updatedProduct = await updateProduct(slug, req);

        successResponse(res,{
            statusCode: 200,
            message: 'Product was updated successfully',    
            payload: {
                updatedProduct
            }
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    handleCreateProduct,
    handleGetAllProducts,
    handleGetSingleProduct,
    handleDeleteProduct,
    handleUpdateProduct,
}