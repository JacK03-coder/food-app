const orderModel = require("../models/order.model");

async function getUserOrders(req, res) {
  try {
    const orders = await orderModel.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getFoodPartnerOrders(req, res) {
  try {
    const orders = await orderModel.find({ foodPartner: req.foodPartner._id }).sort({ createdAt: -1 });
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status, note = "" } = req.body;
    const allowedStatuses = ["preparing", "out_for_delivery", "delivered"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (String(order.foodPartner) !== String(req.foodPartner._id)) {
      return res.status(403).json({ message: "You can only update your own orders" });
    }

    order.status = status;
    order.statusHistory.push({ status, note: note.trim() });
    await order.save();

    return res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  getUserOrders,
  getFoodPartnerOrders,
  updateOrderStatus,
};
