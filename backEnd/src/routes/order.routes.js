const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/user", authMiddleware.authUserMiddleware, orderController.getUserOrders);
router.get("/foodpartner", authMiddleware.authFoodPartnerMiddleware, orderController.getFoodPartnerOrders);
router.patch(
  "/:orderId/status",
  authMiddleware.authFoodPartnerMiddleware,
  orderController.updateOrderStatus
);

module.exports = router;
