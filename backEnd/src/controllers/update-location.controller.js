const foodPartnerModel = require("../models/foodpartner.model");

exports.updateLocation = async (req, res) => {
  try {
    const foodPartnerId = req.params.foodPartnerId;
    const { lat, lng } = req.body;

    if (lat == null || lng == null) {
      return res.status(400).json({ message: "Latitude and Longitude are required" });
    }

    if (String(req.foodPartner._id) !== String(foodPartnerId)) {
      return res.status(403).json({ message: "You can only update your own location" });
    }

    const updated = await foodPartnerModel.findByIdAndUpdate(
      foodPartnerId,
      {
        location: {
          type: "Point",
          coordinates: [lng, lat], // IMPORTANT: lng first
        },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Food partner not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Location updated successfully",
      updated,
    });
  } catch (error) {
    console.log("Error updating location:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
