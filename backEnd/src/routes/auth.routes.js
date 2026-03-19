const express = require('express');
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");


// user API's...
router.post('/user/register' , authController.registerUser);
router.post('/user/login' , authController.loginUser);
router.post('/user/logout' , authController.logoutUser);
router.get('/user/me', authMiddleware.authUserMiddleware, authController.getCurrentUser);
router.put('/user/me', authMiddleware.authUserMiddleware, authController.updateCurrentUser);


//Food Partners APIs ...

router.post('/foodpartner/register' , authController.registerFoodPartner);
router.post('/foodpartner/login' , authController.loginFoodPartner);
router.post('/foodpartner/logout' , authController.logoutFoodPartner);
router.get('/foodpartner/me', authMiddleware.authFoodPartnerMiddleware, authController.getCurrentFoodPartner);
router.put('/foodpartner/me', authMiddleware.authFoodPartnerMiddleware, authController.updateCurrentFoodPartner);

module.exports = router; 
