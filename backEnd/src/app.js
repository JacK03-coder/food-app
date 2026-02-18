require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const authRouters = require("./routes/auth.routes");
const foodRouter = require("./routes/food.routes");
const foodPartnerRouter = require("./routes/food-partner.routes");
const payment = require("./models/razorpay.model");

const app = express();
const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
const allowedOrigins = (process.env.CORS_ORIGINS || frontendURL)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("heeelo , world...!!");
});

app.use("/api/auth", authRouters);
app.use("/api/food", foodRouter);
app.use("/api/foodpartner", foodPartnerRouter);




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
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(body.toString())
      .digest("hex");
    const isAuth = expectedSignature === razorpay_signature;

    if (isAuth) {
      await payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });
      return res.redirect(`${frontendURL}/payment/success`);
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.log("Error in verifying payment: ", error);
    return res.status(500).json({ success: false, message: "Verification failed" });
  }
}

app.post("/api/verify-razorpay/payment", verifyRazorpayPayment);

// Keep old typo-prone route for backward compatibility with existing clients.
app.post("/api/razorpay/verify", verifyRazorpayPayment);

app.get("/api/getkey", (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
});

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

module.exports = app;
