require("dotenv").config();

// server port
const serverPort = process.env.SERVER_PORT || 6000

// data base connection
const mongoDbUrl = process.env.MONGO_DB_URL || "mongodb://localhost:27017/restFullApi"

// user image
const defaultImagePath = process.env.DEFAULT_IMAGE_PATH || "public/images/users/profile.jpg"
const defaultProductImagePath = process.env.DEFAULT_IMAGE_PATH || "public/images/products/profile.jpg"


// JWT
const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || "sdkljfsldkf3454_lsdkjf345@#$%_dkfj4534@%$"
const jwtAccessKey = process.env.JWT_ACCESS_KEY || 'sdlfkjsldf_425@$5l_sdfjafsdj_6787skdjfJSLDF'
const jwtRefreshKey = process.env.JWT_REFRESH_KEY || 'sdlfkjsldf_425@$5l_sdfjafsdj_6787skdjfJSLDF'
const jwtResetPasswordKey = process.env.JWT_RESET_PASSWORD_KEY || 'sdlfkjsldf_425@$5l_sdfjafsdj_6787skdjfJSLDF'



// SMPT SERVER
const smtpUsername = process.env.SMTP_USERNAME || ''
const smtpPassword = process.env.SMTP_PASSWORD || ''

// client url
const clientUrl = process.env.CLIENT_URL || ''


module.exports = {
    serverPort,
    mongoDbUrl,
    jwtActivationKey,
    jwtAccessKey,
    jwtResetPasswordKey,
    jwtRefreshKey,
    defaultImagePath,
    defaultProductImagePath,
    smtpUsername,
    smtpPassword,
    clientUrl
}