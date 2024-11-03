const { model, Schema } = require("mongoose");
const { defaultProductImagePath } = require("../config/secret");



// name, slug, description, price, quantity, sold, shipping, image
const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        minlength: [3, 'The length of product name can be minimum 3 characters'],
        maxlength: [100, 'The length of product name can be maxlength 100 characters'],
    },
    slug: {
        type: String,
        required: [true, 'Product slug is required'],
        lowercase: true,
        unique: true,
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true,
        minlength: [3, 'The length of product description can be minimum 3 characters'],
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        trim: true,
        validate: {
            validator: (v) =>  v > 0,
            message: (props) =>
                `${props.value} is not a valid price ! Price must be greater than 0`
        }
    },
    quantity: {
        type: Number,
        required: [true, 'Product quantity is required'],
        trim: true,
        validate: {
            validator: (v) =>  v > 0,
            message: (props) =>
                `${props.value} is not a valid quantity ! Quantity must be greater than 0`
        }
    },
    sold: {
        type: Number,
        required: [true, 'Sold quantity is required'],
        trim: true,
        default: 0,
        // validate: {
        //     validator: (v) =>  v > 0,
        //     message: (props) =>
        //         `${props.value} is not a valid sold quantity ! Sold Quantity must be greater than 0`
        // }
    }, 
    shipping: {
        type: Number,
        default: 0, // shipping free or paid something amound
    },
    image: {
        type: String, 
        default: defaultProductImagePath,
        // type: Buffer,
        // constentType: String,
        required: [true, "Product image is required"],
    }, 
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    



}, {timestamps: true})

const Product = model('Product', productSchema);
module.exports = Product;