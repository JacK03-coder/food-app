const foodModel = require("../models/food.model");
const foodPartnerModel = require("../models/foodpartner.model");
const storageService = require("../services/storage.service");
const { v4: uuid } = require("uuid");

async function createFood(req, res) {
  try {
    const { name, description, price } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    let videoUrl = null;
    if (req.file) {
      const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid());
      videoUrl = fileUploadResult.url;
    }

    if (!videoUrl) {
      return res
        .status(400)
        .json({ message: "Please upload a video file using multipart form-data" });
    }

    const foodItem = await foodModel.create({
      name,
      description,
      video: videoUrl,
      price,
      foodPartner: req.foodPartner._id,
      foodPartnername: req.foodPartner.name,
    });

    return res.status(201).json({
      message: "Food item created successfully",
      foodItem,
    });
  } catch (error) {
    console.log("Error while creating food:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getFoodItems(req, res) {
  try {
    const foodItems = await foodModel.find({});
    return res.status(200).json({
      message: "Food items fetched successfully",
      foodItems,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getFoodItemById(req, res) {
  try {
    const foodItem = await foodModel.findById(req.params.id);
    if (!foodItem)
      return res.status(404).json({ message: "Food item not found" });

    return res.status(200).json({ message: "Success", foodItem });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getNearbyFood(req, res) {
  const { latitude, longitude } = req.body;

  if (latitude == null || longitude == null) {
    return res.status(400).json({
      message: "Latitude and Longitude are required",
    });
  }

  try {
    // Find nearby food partners
    const foodPartners = await foodPartnerModel.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude], // correct order!!
          },
          $maxDistance: 10000,
        },
      },
    });

    const partnerIds = foodPartners.map((p) => p._id);

    // Find food from those partners
    const foodItems = await foodModel.find({
      foodPartner: { $in: partnerIds },
    });

    return res.json({
      message: "Nearby Food Items Fetched Successfully",
      foodItems,
    });
  } catch (error) {
    console.log("Error in getting nearby food items:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function deleteFoodItem(req, res) {
  try {
    const foodItem = await foodModel.findById(req.params.id);
    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    if (String(foodItem.foodPartner) !== String(req.foodPartner._id)) {
      return res.status(403).json({ message: "You can only delete your own food items" });
    }

    await foodModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Food item deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  createFood,
  getFoodItems,
  getFoodItemById,
  getNearbyFood,
  deleteFoodItem,
};
