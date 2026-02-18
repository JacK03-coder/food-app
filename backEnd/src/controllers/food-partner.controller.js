const foodPartnerModel = require("../models/foodpartner.model");
const foodModel = require("../models/food.model");

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

    return res.status(200).json({
      message: "Food Partner fetched successfully",
      foodPartner: {
        ...foodPartner.toObject(),
        foodItems: foodItemsByFoodPartner,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  getfoodPartnerById,
};
  
