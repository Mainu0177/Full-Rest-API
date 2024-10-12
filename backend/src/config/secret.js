require("dotenv").config();

// server port
const serverPort = process.env.SERVER_PORT || 6000

module.exports = {serverPort}