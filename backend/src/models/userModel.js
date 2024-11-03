const {Schema, model} = require('mongoose');
const bcrypt = require("bcryptjs");
const { defaultImagePath } = require("../config/secret");


const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "User name is required"],
        trim: true,
        minlength: [3, "The length of user name can be minimum 3 characters"],
        maxlength: [31, "The length of user name can be maximum 31 characters"],
    },
    email: {
        type: String, 
        required: [true, "User Email is required"],
        unique: true,
        trip: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v)
            },
            message: "please enter a valid email"
        }
    },
    password: {
        type: String,
        required: [true, "User password is required"],
        minlength: [8, "The length of user password can be minimum 8 characters"],
        set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10))
    },
    image: {
        type: String, 
        default: defaultImagePath,
        // type: Buffer,
        // constentType: String,
        required: [true, "User image is required"],
    }, 
    address: {
        type: String,
        required: [true, "User Address is required"],
        minlength: [4, 'The length of user address can be minimum 4 characters'],
    },
    phone: {
        type: String,
        required: [true, "User phone number is required"],
    }, 
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isBanned: { 
        type: Boolean,
        default: false
    }
}, {timestamps: true});

const User = model("Users", userSchema);

module.exports = User;