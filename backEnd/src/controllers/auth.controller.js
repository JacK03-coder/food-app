const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function sanitizeUser(user) {
  return {
    _id: user._id,
    email: user.email,
    fullName: user.fullName,
    phone: user.phone || "",
    address: user.address || "",
    avatarUrl: user.avatarUrl || "",
    bio: user.bio || "",
    favoriteCuisine: user.favoriteCuisine || "",
    createdAt: user.createdAt,
  };
}

function sanitizeFoodPartner(foodPartner) {
  return {
    _id: foodPartner._id,
    name: foodPartner.name,
    email: foodPartner.email,
    contactName: foodPartner.contactName,
    address: foodPartner.address,
    phone: foodPartner.phone,
    description: foodPartner.description || "",
    cuisineTags: foodPartner.cuisineTags || [],
    openingHours: foodPartner.openingHours || "",
    avatarUrl: foodPartner.avatarUrl || "",
    coverImageUrl: foodPartner.coverImageUrl || "",
    location: foodPartner.location,
    createdAt: foodPartner.createdAt,
  };
}

async function registerUser(req, res) {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isUserAlreadyExists = await userModel.findOne({ email });
    if (isUserAlreadyExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      fullName,
      email,
      password: hashPassword,
    });

    const token = signToken({ _id: user._id, role: "user" });
    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      message: "User registered successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = signToken({ _id: user._id, role: "user" });
    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "User logged in successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function logoutUser(req, res) {
  res.clearCookie("token", cookieOptions);
  return res.status(200).json({ message: "User logout successfully" });
}

async function registerFoodPartner(req, res) {
  try {
    const { name, email, password, contactName, address, phone } = req.body;
    if (!name || !email || !password || !contactName || !address || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isFoodPartnerAlreadyExists = await foodPartnerModel.findOne({ email });
    if (isFoodPartnerAlreadyExists) {
      return res.status(400).json({ message: "Food partner already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const foodPartner = await foodPartnerModel.create({
      name,
      email,
      password: hashPassword,
      contactName,
      address,
      phone,
    });

    const token = signToken({ _id: foodPartner._id, role: "foodpartner" });
    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      message: "Food partner registered successfully",
      foodPartner: sanitizeFoodPartner(foodPartner),
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function loginFoodPartner(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const foodPartner = await foodPartnerModel.findOne({ email });
    if (!foodPartner) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, foodPartner.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = signToken({ _id: foodPartner._id, role: "foodpartner" });
    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "Food partner log in successfully",
      foodPartner: sanitizeFoodPartner(foodPartner),
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function logoutFoodPartner(req, res) {
  res.clearCookie("token", cookieOptions);
  return res.status(200).json({ message: "Food Partner logout successfully" });
}

async function getCurrentUser(req, res) {
  return res.status(200).json({ user: sanitizeUser(req.user) });
}

async function updateCurrentUser(req, res) {
  try {
    const allowedFields = ["fullName", "phone", "address", "avatarUrl", "bio", "favoriteCuisine"];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        req.user[field] = typeof req.body[field] === "string" ? req.body[field].trim() : req.body[field];
      }
    }

    await req.user.save();
    return res.status(200).json({
      message: "User profile updated successfully",
      user: sanitizeUser(req.user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getCurrentFoodPartner(req, res) {
  return res.status(200).json({ foodPartner: sanitizeFoodPartner(req.foodPartner) });
}

async function updateCurrentFoodPartner(req, res) {
  try {
    const allowedFields = [
      "name",
      "contactName",
      "phone",
      "address",
      "description",
      "openingHours",
      "avatarUrl",
      "coverImageUrl",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        req.foodPartner[field] =
          typeof req.body[field] === "string" ? req.body[field].trim() : req.body[field];
      }
    }

    if (req.body.cuisineTags !== undefined) {
      const tags = Array.isArray(req.body.cuisineTags)
        ? req.body.cuisineTags
        : String(req.body.cuisineTags)
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);
      req.foodPartner.cuisineTags = tags;
    }

    await req.foodPartner.save();
    return res.status(200).json({
      message: "Food partner profile updated successfully",
      foodPartner: sanitizeFoodPartner(req.foodPartner),
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
  getCurrentUser,
  updateCurrentUser,
  getCurrentFoodPartner,
  updateCurrentFoodPartner,
};
