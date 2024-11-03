const  mongoose  = require("mongoose");

const createError = require("http-errors");


const findWithId = async (Model, id, options = {}) =>{
    try {
        const item = await Model.findById(id, options);
        if(!item){
            throw createError(404, `${Model.modelName} does not exist with this Id`); // if user not get
        }
        return item;
    } catch (error) {
        if(error instanceof mongoose.Error){
            throw createError(400, "Invalid item Id");
        }
        throw error;
    }

}

module.exports = { findWithId };