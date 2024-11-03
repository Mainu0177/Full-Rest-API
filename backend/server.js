
const app = require('./app')
const connectDatabase = require('./src/config/mongoDb')
const { serverPort } = require("./src/config/secret")
const logger = require('./src/controllers/loggerController')



app.listen(serverPort, async () =>{
    logger.log('info', `Server is running at http://localhost:${serverPort}`)
    await connectDatabase();
})