
const router = require("express").Router()

const {
    handleGetUsers,
    handleGetUserById,
    handleDeleteUserById,
    handleProcessRegister,
    handleActivateUserAccount,
    handleUpdateUserById,
    handleManageUserStatusById,
    handleUpdatePassword,
    handleForgetPassword,
    handleResetPassword,

    } = require("../controllers/userController");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");
const {uploadUserImage} = require("../middlewares/uploadFile");

const runValidation = require("../validations");
const { validateUserRegistration, validateUserUpdatePassword, validateUserForgetPassword, validateUserResetPassword } = require("../validations/auth");

router.get('/', isLoggedIn, isAdmin, handleGetUsers);
router.get('/:id([0-9a-fA-F]{24})', isLoggedIn, handleGetUserById);
router.post('/process-register', uploadUserImage.single('image'), isLoggedOut, validateUserRegistration, runValidation, handleProcessRegister);
router.post('/activate', isLoggedOut, handleActivateUserAccount);
router.delete('/:id([0-9a-fA-F]{24})', isLoggedIn, handleDeleteUserById);
router.put('/:id([0-9a-fA-F]{24})', uploadUserImage.single('image'), isLoggedIn, handleUpdateUserById);
router.put('/manage-user/:id([0-9a-fA-F]{24})', isLoggedIn, isAdmin, handleManageUserStatusById);
router.put('/update-password/:id([0-9a-fA-F]{24})', validateUserUpdatePassword, runValidation, isLoggedIn, handleUpdatePassword);
router.post('/forget-password', validateUserForgetPassword, runValidation, handleForgetPassword);
router.put('/reset-password', validateUserResetPassword, runValidation, handleResetPassword);




module.exports = router;