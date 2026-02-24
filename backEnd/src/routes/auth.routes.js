const express = require('express');
const router = express.Router();

const authController = require("../controllers/auth.controller");


// user API's...
router.post('/user/register' , authController.registerUser);
router.post('/user/login' , authController.loginUser);
router.post('/user/logout' , authController.logoutUser);


//Food Partners APIs ...

router.post('/foodpartner/register' , authController.registerFoodPartner);
router.post('/foodpartner/login' , authController.loginFoodPartner);
router.post('/foodpartner/logout' , authController.logoutFoodPartner);

module.exports = router; 
