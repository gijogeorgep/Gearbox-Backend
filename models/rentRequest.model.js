const mongoose = require("mongoose");

const rentRequestSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: String,
  email: String,
  sellerEmail: String,
  phoneNumber: String,
  location: String,
  pincode: String,
  address: String,
  startDate: Date,
  endDate: Date,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "Booked"],
    default: "pending",
  },

  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const rentRequest = mongoose.model("rentRequest", rentRequestSchema);

module.exports = { rentRequest };
