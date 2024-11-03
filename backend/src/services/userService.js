const createError = require("http-errors");
const User = require("../models/userModel");
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const  cloudinary  = require("../config/cloudinary")

const { deleteImage } = require("../helper/deleteImage");
const { createJSONWebToken } = require("../helper/jsonWebToken");
const { jwtResetPasswordKey, clientUrl } = require("../config/secret");
const { emailWithNodeMailer } = require("../helper/email");
const { publicIdWithoutExtensionFromUrl, deleteFileFromCloudinary } = require("../helper/cloudinaryHelper");




// user find service
const findUsers = async (search, limit, page) =>{
    try {
        const searchRegExp = new RegExp('.*' + search + '.*', 'i');
        const filter = {
            isAdmin: {$ne: true },
            $or:[
                {name: {$regex: searchRegExp}},
                {email: {$regex: searchRegExp}},
                {phone: {$regex: searchRegExp}},
            ],
        };

        const options = {password: 0};

        const users = await User.find(filter, options)
        .limit(limit)
        .skip((page - 1) * limit);

        const count = await User.find(filter).countDocuments();

        if(!users || users.length === 0) throw createError(404, 'no users found')

        return {
            users,
            pagination: {
                totalPage: Math.ceil(count / limit),
                currentPage: page,
                previousPage: page - 1 > 0 ? page-1 : null,
                nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
            }
        }
    } catch (error) {
        throw (error)
    }
}

// user find by id service
const findUserById = async (id, options = {}) =>{
    try {
        const user = await User.findById(id, options);
        if(!user) {
            throw createError(404, 'User not found');
        }
        return user;
    } catch (error) {
        throw error;
    }
}

// user delete by id service
const deleteUserById = async (id, options = {}) =>{
    try {
        const existingUser = await User.findOne({
            _id: id,
        });
        if(existingUser && existingUser.image){
            const publicId = await publicIdWithoutExtensionFromUrl(existingUser.image);
            deleteFileFromCloudinary('ecommerceMern/users', publicId, 'User');
        }

         // server user delete
        const user = await User.findByIdAndDelete({_id: id, isAdmin: false});
        if(user && user.image) {
            await deleteImage(user.image);
        }
    } catch (error) {
        if(error instanceof mongoose.Error.CastError){
            throw createError(400, 'Invalid Id')
        }
        throw error;
    }
}

// user update by id service
const updateUserById = async (userId, req) =>{
    try {
        const options = { password: 0 };
        const user = await findUserById(userId, options);
        if(!user){
            throw createError(404, 'User not found')
        }

        const updateOptions = {new: true, runValidators: true, context: "query" };
        let updates = {};

        const allowedFields = ['name', 'password', 'phone', 'address']
        for(const key in req.body){
            if(allowedFields.includes(key)) {
                updates[key] = req.body[key];
            }
            else if(key === 'email'){
                throw createError(400, "Email can not be updated")
            }
        }

        const image = req.file?.path;
        if(image){
            // image size maximum 2 mb
            if(image.size > 2097152){
                throw createError(400, "File too large. It must be less then 2 MB")
            }
            const response = await cloudinary.uploader.upload(image, { folder: 'ecommerceMern/users', });
            updates.image = response.secure_url;
        }
        
        // delete updates.email
        const updatedUser = await User.findByIdAndUpdate(userId, updates, updateOptions)
        .select("-password")

        if(!updatedUser){
            throw createError(404, "User with this ID does not exist")
        }

        // delete the previous product image from cloudinary
        if(user.image){
            const publicId = await publicIdWithoutExtensionFromUrl(user.image);
            await deleteFileFromCloudinary('ecommerceMern/users', publicId, 'User');
        }

        return updatedUser;
    } catch (error) {
        if(error instanceof mongoose.Error.CastError){
            throw createError(400, 'Invalid Id')
        }
        throw error;
    }
}

// update user password service 
const updateUserPasswordById = async (userId, email, oldPassword, newPassword, confirmPassword) =>{
    try {
        const user = await User.findOne({email: email});

        if(!user){
            throw createError(404, 'User is not found with this email')
        }
        
        if(newPassword != confirmPassword) {
            throw createError(400, 'New password and old password did not match')
        }

        // compare the password or match the password
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if(!isPasswordMatch){
            throw createError(400, 'Old password is incorrect')
        }

        // update functionality
        // const filter = {userId};
        const updates = {$set: {password: newPassword}};
        const updateOptions = {new: true};
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            updateOptions,
        ).select('-password');

        if(!updatedUser) {
            throw createError(400, 'User password was not updated successfully')
        }
        return updatedUser;
    } catch (error) {
        throw error;
    }
}

// Forget user password service
const forgetUserPasswordByEmail = async (email) =>{
    try {
        const userData = await User.findOne({email: email});
        if(!userData) {
            throw createError(404, 'Email is incorrect or you have not verified your email address. Please register yourself first')
        }

        // create jwt
        const token = createJSONWebToken({email}, jwtResetPasswordKey, '10m');
        
        // prepare email
        const emailData = {
            email,
            subject: 'Reset password Email',
            html: `
            <h2>Hello ${userData.name} ! </h2>
            <p> Please Click here to <a href = "${clientUrl}/api/users/reset-password/${token}" target= "_blank" >Reset your password </a> </p>
            `,
        }

        // send email with nodemailer
        try {
            await emailWithNodeMailer(emailData);
        } catch (emailError) {
            next(createError(500, 'Failed to send reset password email'));
            return ;
        }
        return token;
    } catch (error) {
        throw error;
    }
}

// Reset user password service
const resetUserPassword = async (token, password) =>{
    try {
        const decoded = jwt.verify(token, jwtResetPasswordKey);

        if(!decoded) {
            throw createError(400, 'Invalid or expired token')
        }

        const filter = {email: decoded.email};
        const update = {password: password};
        const options = {new: true};
        const updatedUser = await User.findOneAndUpdate(
            filter,
            update,
            options,
        ).select('-password');
        if(!updatedUser){
            throw createError(400, 'Password reset failed')
        }
    } catch (error) {
        throw error
    }
}

// ban and unband services
const handleUserAction = async (userId,action) =>{
    try {
        let update;
        let successMessage;
        if(action === 'ban'){
            update = { isBanned: true };
            successMessage = 'User was banned successfully'
        }else if(action === 'unban'){
            update = { isBanned: false };
            successMessage = 'User was unbanned successfully'
        }else{
            throw createError(400, 'Invalid action. Use "ban" or "unban"');
        }

        const updateOptions = {new: true, runValidators: true, context: 'query'};

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            update,
            updateOptions
        ).select('-password')

        if(!updatedUser){
            throw createError(404, 'User was not banned successfully')
        }
        return successMessage;
    } catch (error) {
        if(error instanceof mongoose.Error.CastError){
            throw createError(400, 'Invalid Id')
        }
        throw (error)
    }
}


module.exports = {
    findUsers,
    findUserById,
    deleteUserById,
    updateUserById,
    updateUserPasswordById,
    forgetUserPasswordByEmail,
    resetUserPassword,
    handleUserAction,
}