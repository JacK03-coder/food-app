const express = require("express");
const router = express.Router();
const foodPartnerController = require("../controllers/food-partner.controller");
const foodController = require("../controllers/food.controller");
const updatefoodController = require("../controllers/update-location.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/:id", foodPartnerController.getfoodPartnerById);
router.get("/" , foodController.getFoodItems);
router.put("/:foodPartnerId/location", authMiddleware.authFoodPartnerMiddleware, updatefoodController.updateLocation);

module.exports = router;
