const mongoose = require("mongoose");

const foodPartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contactName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String },
  description: { type: String, default: "" },
  cuisineTags: { type: [String], default: [] },
  openingHours: { type: String, default: "" },
  avatarUrl: { type: String, default: "" },
  coverImageUrl: { type: String, default: "" },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      default:[0,0]
    },
  },
}, {
  timestamps: true,
});

foodPartnerSchema.index({location: "2dsphere"});  //Enabling geospatial queries 

const foodPartnerModel = mongoose.model("foodpartner", foodPartnerSchema);

module.exports = foodPartnerModel;
