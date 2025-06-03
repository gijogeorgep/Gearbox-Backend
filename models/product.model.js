const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  sellername: {
    type: String,
  },

  sellerPhone: {
    type: Number,
  },

  itemType: {
    type: String,
    required: true,
    enum: ["camera", "tripod", "lens", "gimbal"],
  },

  brand: {
    type: String,
    trim: true,
    required: function () {
      return this.itemType === "camera";
    },
  },

  name: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    required: true,
    trim: true,
  },

  detailedDescription: {
    type: [String],
    trim: true,
    default: [],
  },

  imageUrl: {
    type: String,
    required: true,
  },

  smallImages: {
    type: [String],
    default: [],
  },

  location: {
    type: String,
  },

  rate: {
    type: Number,
    required: true,
    min: 0,
  },

  cautionDeposit: {
    type: Number,
    required: true,
    min: 0,
  },

  totalAmount: {
    type: Number,
    min: 0,
  },

  tutorialLink: {
    type: String,
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = { Product };
