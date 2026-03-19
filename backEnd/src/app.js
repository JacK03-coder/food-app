require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const authRouters = require("./routes/auth.routes");
const foodRouter = require("./routes/food.routes");
const foodPartnerRouter = require("./routes/food-partner.routes");
const orderRouter = require("./routes/order.routes");
const payment = require("./models/razorpay.model");
const orderModel = require("./models/order.model");
const foodModel = require("./models/food.model");
const authMiddleware = require("./middlewares/auth.middleware");

const app = express();
const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
const backendURL =
  process.env.BACKEND_URL || "https://food-app-backend-r8v9.onrender.com";
const localDevOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const configuredOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = Array.from(
  new Set([frontendURL, backendURL, ...localDevOrigins, ...configuredOrigins])
);
const allowVercelPreviews = true;

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;

  if (allowVercelPreviews) {
    try {
      const host = new URL(origin).hostname;
      if (host.endsWith(".vercel.app")) return true;
    } catch {
      return false;
    }
  }

  return false;
}

app.use(cookieParser());
app.use(express.json());
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Always echo request origin when present so browsers accept credentialed CORS.
  // This avoids deployment/env mismatches blocking frontend requests.
  if (origin) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
  }
  if (!origin || isAllowedOrigin(origin)) {
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  return next();
});

app.get("/", (req, res) => {
  res.send("heeelo , world...!!");
});

app.use("/api/auth", authRouters);
app.use("/api/food", foodRouter);
app.use("/api/foodpartner", foodPartnerRouter);
app.use("/api/orders", orderRouter);




// Payment Gateway Integration with Razorpay
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

app.post("/api/razorpay/order", async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount) * 100,
      currency: "INR",
      receipt: "receipt_" + Math.floor(Math.random() * 100),
    };

    const order = await instance.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.log("Error in creating order:", error);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
});

async function verifyRazorpayPayment(req, res) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const { foodId, pricing = {}, deliveryAddress = "", redirect = false } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(body.toString())
      .digest("hex");
    const isAuth = expectedSignature === razorpay_signature;

    if (isAuth) {
      const existingPayment = await payment.findOne({ razorpay_payment_id });
      if (!existingPayment) {
        await payment.create({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        });
      }

      let createdOrder = await orderModel.findOne({
        "payment.razorpayPaymentId": razorpay_payment_id,
      });

      if (!createdOrder && req.user && foodId) {
        const foodItem = await foodModel.findById(foodId);

        if (!foodItem) {
          return res.status(404).json({ success: false, message: "Food item not found" });
        }

        createdOrder = await orderModel.create({
          user: req.user._id,
          food: foodItem._id,
          foodPartner: foodItem.foodPartner,
          foodName: foodItem.name,
          partnerName: foodItem.foodPartnername || "Food Partner",
          pricing: {
            itemTotal: Number(pricing.itemTotal || foodItem.price),
            platformCharge: Number(pricing.platformCharge || 0),
            deliveryCharge: Number(pricing.deliveryCharge || 0),
            totalAmount: Number(pricing.totalAmount || foodItem.price),
          },
          deliveryAddress:
            deliveryAddress || req.user.address || "Address not added yet",
          payment: {
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
          },
          status: "ordered",
          statusHistory: [{ status: "ordered", note: "Payment verified" }],
        });
      }

      if (redirect) {
        return res.redirect(`${frontendURL}/payment/success`);
      }

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        order: createdOrder,
      });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.log("Error in verifying payment: ", error);
    return res.status(500).json({ success: false, message: "Verification failed" });
  }
}

app.post("/api/verify-razorpay/payment", authMiddleware.authUserMiddleware, verifyRazorpayPayment);

// Keep old typo-prone route for backward compatibility with existing clients.
app.post("/api/razorpay/verify", verifyRazorpayPayment);

app.get("/api/getkey", (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
});

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

module.exports = app;
