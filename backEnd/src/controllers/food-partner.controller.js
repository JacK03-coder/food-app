const foodPartnerModel = require("../models/foodpartner.model");
const foodModel = require("../models/food.model");
const orderModel = require("../models/order.model");

async function getfoodPartnerById(req, res) {
  try {
    const foodPartnerId = req.params.id;
    const foodPartner = await foodPartnerModel.findById(foodPartnerId);

    if (!foodPartner) {
      return res.status(404).json({ message: "Food Partner not found", foodPartner });
    }

    const foodItemsByFoodPartner = await foodModel.find({
      foodPartner: foodPartnerId,
    });
    const deliveredOrders = await orderModel.countDocuments({
      foodPartner: foodPartnerId,
      status: "delivered",
    });

    return res.status(200).json({
      message: "Food Partner fetched successfully",
      foodPartner: {
        ...foodPartner.toObject(),
        foodItems: foodItemsByFoodPartner,
        totalMeals: foodItemsByFoodPartner.length,
        customerServed: deliveredOrders,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  getfoodPartnerById,
};
  
