const createError = require('http-errors')
const User = require("../models/userModel");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { successResponse } = require('../helper/responseController');
const { createJSONWebToken } = require('../helper/jsonWebToken');
const { jwtAccessKey, jwtRefreshKey } = require('../config/secret');


// Login function
const handleLogin = async (req, res, next) =>{
    try {
        // email , password -> req.body
        const {email, password} = req.body;

        // isExist 
        const user = await User.findOne({ email });
        if(!user){
            throw createError(404, 'User does not exist with this email. Please register first');
        }
        // compare the password or match the password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            throw createError(401, 'Email/password did not match')
        }
        // isBanned
        if(user.isBanned) {
            throw createError(403, 'You are Banned. Please contact authority')
        } 

        // access token, cookie  -> valid user?
        const accessToken = createJSONWebToken({ user }, jwtAccessKey, '5m');
        res.cookie('accessToken', accessToken,{
            maxAge: 5 * 60 * 1000, // 1 minutes
            httpOnly: true,
            // secure: true,
            sameSite: 'none'
        })

        // Refresh token, cookie  -> valid user?
        const refreshToken = createJSONWebToken({ user }, jwtRefreshKey, '7d');
        res.cookie('refreshToken', refreshToken,{
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true,
            // secure: true,
            sameSite: 'none'
        })

        // user withouth password
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        // success response
        successResponse(res,{
            statusCode: 200,
            message: 'User was logged in successfully',
            payload: {userWithoutPassword}
        })
    } catch (error) {
        next(error)
    }
}

// Log Out function
const handleLogOut = async (req, res, next) =>{
    try {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        successResponse(res, {
            statusCode: 200,
            message: 'User logged out successfully',
            payload: {}
        })
    } catch (error) {
        next(error)
    }
}

// create refresh token
const handleRefreshToken = async (req, res, next) =>{
    try {
        const oldRefreshToken = req.cookies.refreshToken;

        // verify the old refresh token
        const decodedToken = jwt.verify(oldRefreshToken, jwtRefreshKey);

        if(!decodedToken) {
            throw createError(400, 'Invalid refresh token. Please login again');
        }

        // access token, cookie  -> valid user?
        const accessToken = createJSONWebToken( decodedToken.user , jwtAccessKey, '5m');
        res.cookie('accessToken', accessToken,{
            maxAge: 5 * 60 * 1000, // 1 minutes
            httpOnly: true,
            // secure: true,
            sameSite: 'none'
        });
        return successResponse(res, {
            statusCode: 200,
            message: 'New access token is generated',
            payload: {},
        })

    } catch (error) {
        next(error)
    }
}

// create protected access token route
const handleProtectedRoute = async (req, res, next) =>{
    try {
        const accessToken = req.cookies.accessToken;

        // verify the access token
        const decodedToken = jwt.verify(accessToken, jwtAccessKey);
        if(!decodedToken){
            throw createError(400, 'Invalid access token. Please login again')
        }

        return successResponse(res,{
            statusCode: 200,
            message: 'Protected resourcess accessed successfully',
            payload: {}
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    handleLogin,
    handleLogOut,
    handleRefreshToken,
    handleProtectedRoute
}