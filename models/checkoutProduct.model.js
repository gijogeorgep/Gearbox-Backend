const mongoose = require("mongoose");
const checkoutSchema = new mongoose.Schema({
  productId: String,
  name: String,
  sellerName: String,
  ratePerDay: Number,
  addonDays: Number,
  addonCost: Number,
  cautionDeposit: Number,
  deliveryFee: Number,
  totalPay: Number,
  paymentId: String, // Razorpay payment ID
  orderId: String, // Razorpay order ID
  status: String, // Payment status (e.g., Captured, Failed)
});

const Checkout = mongoose.model("Checkout", checkoutSchema);

module.exports = { Checkout };
