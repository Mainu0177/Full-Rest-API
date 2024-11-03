
const createError = require("http-errors");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");

const { successResponse } = require("../helper/responseController");
// const { findWithId } = require("../services/findItem");
// const { deleteImage } = require("../helper/deleteImage");
const {createJSONWebToken} = require("../helper/jsonWebToken");
const { jwtActivationKey, clientUrl } = require("../config/secret");
const { emailWithNodeMailer } = require("../helper/email");
const {
        handleUserAction,
        findUsers,
        findUserById,
        deleteUserById,
        updateUserById,
        updateUserPasswordById,
        forgetUserPasswordByEmail,
        resetUserPassword
} = require("../services/userService");



// get all users
const handleGetUsers = async (req, res, next) =>{
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const {users, pagination} = await findUsers(search, limit, page) // create services

        return successResponse(res, {
            statusCode: 200,
            message: 'User were returned successfully',
            payload: {
                users: users,
                pagination: pagination
            },
        });

    } catch (error) {
        next(error)
    }
}

// get user by id
const handleGetUserById = async (req, res, next) =>{
    try {
        const id = req.params.id;
        const options = {password: 0};
        const user = await findUserById( id, options ) // create find user service

        return successResponse(res, {
            statusCode: 200,
            message: 'User was returned successfully',
            payload: {user},
        });
    } catch (error) {
        next(error)
    }
}

// delete user by id
const handleDeleteUserById = async (req, res, next) =>{
    try {
        const id = req.params.id;
        const options = {password: 0};
        await deleteUserById( id, options); // create delete user service

        return successResponse(res, {
            statusCode: 200,
            message: "User was deleted successfully"

        })
    } catch (error) {
        next(error)
    }
}

// Registration proccess
const handleProcessRegister = async (req, res, next) =>{
    try {
        const {name, email, password, phone, address} = req.body;

        const image = req.file?.path;
        if(!image){
            throw createError(400, 'Image file is required');
        }
        if(image && image.size > 2097152){
            throw createError(400, 'File too large. It must be less than 2MB')
        }
        // if(image.size > 2097152) {
        //     throw createError(400, 'File too large. It must be less than 2 MB');
        // }
        // const imageBufferString = image.buffer.toString('base64')

        const userExists = await User.exists({ email: email });
        if(userExists) {
            throw createError(409, 'User with this email already exists. Please sign in')
        }

        // create jwt
        const tokenPayloadData = {
            name,
            email,
            password,
            phone,
            address,
        }
        if(image) {
            tokenPayloadData.image = image;
        };
        const token = createJSONWebToken(tokenPayloadData, jwtActivationKey, '10m');
        
        // prepare email
        const emailData = {
            email,
            subject: 'Account Activation Email',
            html: `
            <h2>Hello ${name} ! </h2>
            <p> Please Click here to <a href = "${clientUrl}/api/users/activate/${token}" target= "_blank" >activate your account </a> </p>
            `,
        }

        // send email with nodemailer
        try {
            await emailWithNodeMailer(emailData);
        } catch (emailError) {
            next(createError(500, 'Failed to send verification email'));
            return ;
        }

        return successResponse(res, {
            statusCode: 200,
            message: `Please go to your ${email} for completing your registration process`,
            payload: {
                token
            }
        })
    } catch (error) {
        next(error)
    }
}

// verify user
const handleActivateUserAccount = async (req, res, next) =>{
    try {
        const token = req.body.token;
        if(!token) throw createError(404, "token not found");

        try {
            const decoded = jwt.verify(token, jwtActivationKey);
            if(!decoded) throw createError(401, "Unable to verify user");

            const userExists = await User.exists({email: decoded.email});
            if(userExists) {
                throw createError(409, 'User with this email already exists. Please sign in')
            }

            // cloudinary methods
            const image = decoded.image;
            if(image){
                const response = await cloudinary.uploader.upload(image, {folder: 'ecommerceMern/users', });
                decoded.image = response.secure_url;
            }

            // user create
            await User.create(decoded);

            return successResponse(res,{
                statusCode: 201,
                message: "User was registered successfully",
            });
        } catch (error) {
            if(error.name = 'TokenExpiredError'){
                throw createError(401, 'Token has expired');
            }else if(error.name = 'jsonWebTokenError'){
                throw createError(401, 'Invalid Token')
            }else{
                throw error;
            }
        }
    } catch (error) {
        next(error)
    }
}

// update user by id
const handleUpdateUserById = async (req, res, next) =>{
    try {
        const userId = req.params.id;
        const updatedUser = await updateUserById(userId, req); // create update service
        return successResponse(res, {
            statusCode: 200,
            message: "User was updated successfully",
            payload: {
                updatedUser
            }
        });
    } catch (error) {
        next(error);
    }
}

// ban user
const handleManageUserStatusById = async (req, res, next) =>{
    try {
        const userId = req.params.id;
        const action = req.body.action;

        const successMessage = await handleUserAction(action, userId); // create service
        
        return successResponse(res,{
            statusCode: 200,
            message: successMessage,
        })

    } catch (error) {
        next(error)
    }
}

// unban user
// const handleUnbanUserById = async (req, res, next) =>{
//     try {
//         const userId = req.params.id;
//         await findWithId(User, userId);
//         const updates = {isBanned: false};
//         const updateOptions = {new: true, runValidators: true, context: 'query'};

//         const updatedUser = await User.findByIdAndUpdate(
//             userId,
//             updates,
//             updateOptions,
//         ).select('-password')

//         if(!updatedUser){
//             throw createError(400, 'User was not unbanned successfully')
//         }

//         return successResponse(res, {
//             statusCode: 200,
//             message: 'User was unbanned successfully'
//         })
//     } catch (error) {
//         next(error)
//     }
// }

// update user password
const handleUpdatePassword = async (req, res, next) =>{
    try {
        // i will receive -> email, oldPassword, newPassword, confirmPassword
        const {email, oldPassword, newPassword, confirmpassword} = req.body;
        const userId = req.params.id;
        
        const updatedUser = await updateUserPasswordById(userId, email, oldPassword, newPassword, confirmpassword)

        successResponse(res, {
            statusCode: 200,
            message: 'User password was updated successfully',
            payload: {
                updatedUser
            },
        })
    } catch (error) {
        next(error)
    }
}

// forget user password
const handleForgetPassword = async (req, res, next) =>{
    try {
        const {email} = req.body;
        
        const token = await forgetUserPasswordByEmail(email);

        return successResponse(res, {
            statusCode: 200,
            message: `Please go to your ${email} to reset the password`,
            payload: {
                token
            }
        })
    } catch (error) {
        next(error)
    }
}

// Reset user password
const handleResetPassword = async (req, res, next) =>{
    try {
        const {token, password} = req.body;
        await resetUserPassword(token, password);

        successResponse(res, {
            statusCode: 200, 
            message: 'User password reset seccessfully',
            payload: {
                
            }
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    handleGetUsers,
    handleGetUserById,
    handleDeleteUserById,
    handleProcessRegister,
    handleActivateUserAccount,
    handleUpdateUserById,
    handleManageUserStatusById,
    handleUpdatePassword,
    handleForgetPassword,
    handleResetPassword,
}



