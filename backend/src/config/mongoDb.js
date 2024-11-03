const { default: mongoose } = require("mongoose")
const { mongoDbUrl } = require("./secret");
const logger = require("../controllers/loggerController");



const connectDatabase = async (option = {}) =>{
    try {
        await mongoose.connect(mongoDbUrl, option);
        logger.log('info',"MongoDb is connected successfully");

        mongoose.connection.on("error", (error) =>{
            logger.log('error', "DB connection faild: ", error);
        });
    } catch (error) {
        logger.log('error', "Could not connect to DB: ", error.toString())
    }
}

module.exports = connectDatabase;