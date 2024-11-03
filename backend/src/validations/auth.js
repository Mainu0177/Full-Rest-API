const {body} = require('express-validator');

// registration validation
const validateUserRegistration = [  
    body('name')
        .trim()
        .notEmpty()
        .withMessage("Name is required. Enter your full name")
        .isLength({min: 3, max: 31})
        .withMessage("Name should be at least 3-31 character long"),
    body('email')
        .trim()
        .notEmpty()
        .withMessage("Email is required. Enter your email address")
        .isEmail()
        .withMessage("Invalide Email address"),
    body('password')
        .trim()
        .notEmpty()
        .withMessage("Password is required. Enter your password")
        .isLength({min: 8})
        .withMessage("Password should be at least 8 character long")
        .matches(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[-\#\$\.\%\&\*])(?=.*[a-zA-Z]).{8,16}$/)
        .withMessage("Password should contain at least one upprecase letter, one lowercase letter, one nubmer, and one special character."),
    body('address')
        .trim()
        .notEmpty()
        .withMessage("Address is required. Enter your home address")
        .isLength({min: 4})
        .withMessage("Address should be at least 4 character long "),
    body('phone')
        .trim()
        .notEmpty()
        .withMessage("Phone is required. Enter your phone number"),
    body('image')
        .optional()
        .isString()
        .withMessage("User image is optional")
    // body('image')
    //     .custom((value, {req}) =>{
    //         if(!req.file || !req.file.buffer){
    //             throw new Error("User image is required");
    //         }
    //         return true
    //     })
    //     .withMessage("User image is required")
];

// log in validation
const validateUserLoggedIn = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage("Email is required. Enter your email address")
        .isEmail()
        .withMessage("Invalide Email address"),
    body('password')
        .trim()
        .notEmpty()
        .withMessage("Password is required. Enter your password")
        .isLength({min: 8})
        .withMessage("Password should be at least 8 character long")
        .matches(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[-\#\$\.\%\&\*])(?=.*[a-zA-Z]).{8,16}$/)
        .withMessage("Password should contain at least one upprecase letter, one lowercase letter, one nubmer, and one special character."),
]

// update password validation
const validateUserUpdatePassword = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage("Email is required. Enter your email address")
        .isEmail()
        .withMessage("Invalide Email address"),
    body('oldPassword')
        .trim()
        .notEmpty()
        .withMessage("Old Password is required. Enter your old password")
        .isLength({min: 8})
        .withMessage("Old Password should be at least 8 character long")
        .matches(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[-\#\$\.\%\&\*])(?=.*[a-zA-Z]).{8,16}$/)
        .withMessage("Password should contain at least one upprecase letter, one lowercase letter, one nubmer, and one special character."),
    body('newPassword')
        .trim()
        .notEmpty()
        .withMessage("New Password is required. Enter your new password")
        .isLength({min: 8})
        .withMessage("New Password should be at least 8 character long")
        .matches(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[-\#\$\.\%\&\*])(?=.*[a-zA-Z]).{8,16}$/)
        .withMessage("Password should contain at least one upprecase letter, one lowercase letter, one nubmer, and one special character."),
    body('confirmPassword').custom((value, { req }) =>{
        if(value != req.body.newPassword){
            throw new Error('Password did not match');
        }
        return true;
    }),
];

// forget password validation
const validateUserForgetPassword = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage("Email is required. Enter your email address")
        .isEmail()
        .withMessage("Invalide Email address"),
]

// Reset password validation
const validateUserResetPassword = [
    body('token')
        .trim()
        .notEmpty()
        .withMessage("Token is missing"),
    body('password')
        .trim()
        .notEmpty()
        .withMessage("Password is required. Enter your password")
        .isLength({min: 8})
        .withMessage("Password should be at least 8 character long")
        .matches(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[-\#\$\.\%\&\*])(?=.*[a-zA-Z]).{8,16}$/)
        .withMessage("Password should contain at least one upprecase letter, one lowercase letter, one nubmer, and one special character."),
]



module.exports = {
    validateUserRegistration,
    validateUserLoggedIn,
    validateUserUpdatePassword,
    validateUserForgetPassword,
    validateUserResetPassword, 
}

