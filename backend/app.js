const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser')
const morgan = require("morgan");
const createError = require("http-errors");
const xssClean = require("xss-clean");
const ratelimit = require("express-rate-limit");

const { errorResponse } = require('./src/helper/responseController');
const router = require("./src/routes/userRouter");
const seedRouter = require("./src/routes/seedRouter");
const authRouter = require("./src/routes/authRouter");
const categoryRouter = require("./src/routes/categoryRouter");
const productRouter = require("./src/routes/productRouter");


const app = express();

// api secure
const ratelimiter = ratelimit({
    windowMs: 5 * 60 * 1000, // 5 minutes,
    max: 10,
    message: 'Too many requests from this IP, Please try again later'
});

app.use(cors());
app.use(cookieParser())
app.use(xssClean())
app.use(morgan('dev'));
app.use(ratelimiter)
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// routers
app.use('/api/users', router)

// seed users
app.use('/api/seed', seedRouter)

// auth router
app.use('/api/auth', authRouter)

// category router
app.use('/api/categories', categoryRouter)

// products router
app.use('/api/products', productRouter)

//client error handling
app.use((req, res, next) =>{
    next(createError(404, "Route not found"))
})

// Server error handling -> all the error
app.use((err, req, res, next) =>{
    return errorResponse(res, {
        statusCode: err.status,
        message: err.message,
    })
})

module.exports = app;