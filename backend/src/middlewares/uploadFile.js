
const multer = require('multer')
// const path = require('path');
const { UPLOAD_USER_IMAGE_DIRECTORY, UPLOAD_PRODUCT_IMAGE_DIRECTORY, ALLOWED_FILE_TYPES, MAX_FILE_SIZE } = require('../config/config');


// disk Stotorage
const userStorage = multer.diskStorage({ // upload user image
    // destination: function (req, file, cb) {
    //     cb(null, UPLOAD_USER_IMAGE_DIRECTORY)
    // },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
})

// upload product image
const productStorage = multer.diskStorage({ // upload user image
    // destination: function (req, file, cb) {
    //     cb(null, UPLOAD_PRODUCT_IMAGE_DIRECTORY)
    // },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
})

// file filter
const fileFilter = async (req, file, cb) =>{
    // server storage function
    if(!ALLOWED_FILE_TYPES.includes(file.mimetype)){
        return cb (new Error('File type not allowed'), false);
    }
    cb(null, true)
}

const uploadUserImage = multer({
    storage: userStorage,
    limits: {fileSize: MAX_FILE_SIZE},
    fileFilter: fileFilter,
});

const uploadProductImage = multer({
    storage: productStorage,
    limits: {fileSize: MAX_FILE_SIZE},
    fileFilter: fileFilter,
});

module.exports = {uploadUserImage, uploadProductImage};



