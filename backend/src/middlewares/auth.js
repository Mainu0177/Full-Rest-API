
const createError = require('http-errors');
const jwt = require('jsonwebtoken')
const { jwtAccessKey } = require('../config/secret');

// Log in middleware
const isLoggedIn = async (req, res, next) =>{
    try {
        const accessToken = req.cookies.accessToken;
        if(!accessToken) {
            throw createError(401, 'Access token not found. Please login')
        }
        // token verify
        const decoded = jwt.verify(accessToken, jwtAccessKey);
        if(!decoded){
            throw createError(401, 'Invalid access token. Please login again');
        }
        req.user = decoded.user;
        next();
    } catch (error) {
        return next(error);
    }
}

// Log out middleware
const isLoggedOut = async (req, res, next) =>{
    try {
        const accessToken = req.cookies.accessToken;
        if(accessToken){
            try {
                const decoded = jwt.verify(accessToken, jwtAccessKey);
                if(decoded){
                    throw createError(400, 'User is already logged in');
                }
            } catch (error) {
                throw error;
            }
        }
        next();
    } catch (error) {
        return next(error);
    }
}

// is admin middleware
const isAdmin = async (req, res, next) =>{
    try {
        console.log(req.user.isAdmin);
        if(!req.user.isAdmin){
            throw createError(403, 'Forbidden. You must be an admin to access this resource');
        }
        next();
    } catch (error) {
        return next(error)
    }
} 

module.exports = { isLoggedIn, isLoggedOut, isAdmin}