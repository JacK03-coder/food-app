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

    const token = signToken({ _id: user._id });
    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
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

    const token = signToken({ _id: user._id });
    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
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

    const token = signToken({ _id: foodPartner._id });
    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      message: "Food partner registered successfully",
      foodPartner: {
        _id: foodPartner._id,
        email: foodPartner.email,
        name: foodPartner.name,
        contactName: foodPartner.contactName,
        address: foodPartner.address,
        phone: foodPartner.phone,
      },
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

    const token = signToken({ _id: foodPartner._id });
    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "Food partner log in successfully",
      foodpartner: {
        _id: foodPartner._id,
        name: foodPartner.name,
        email: foodPartner.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function logoutFoodPartner(req, res) {
  res.clearCookie("token", cookieOptions);
  return res.status(200).json({ message: "Food Partner logout successfully" });
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
};
