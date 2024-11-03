
const authRouter = require('express').Router();

const {
    handleLogin,
    handleLogOut,
    handleRefreshToken,
    handleProtectedRoute
} = require('../controllers/authController');
const { isLoggedOut, isLoggedIn } = require('../middlewares/auth');
const runValidation = require('../validations');
const { validateUserLoggedIn } = require('../validations/auth');

authRouter.post('/login', validateUserLoggedIn, runValidation, isLoggedOut, handleLogin);
authRouter.post('/logout', isLoggedIn,  handleLogOut);
authRouter.get('/refresh-token', handleRefreshToken);
authRouter.get('/protected', handleProtectedRoute)


module.exports = authRouter;