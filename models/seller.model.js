const mongoose = require("mongoose");
const sellerScheme = new mongoose.Schema({
  name: String,
  email: String,
  username: String,
  phone: Number,
  password: String,
  profileImg: String,
  confirmpassword: String,
  role: { type: String, enum: ["admin", "seller"], default: "seller" },
});

const Seller = mongoose.model("Seller", sellerScheme);

module.exports = { Seller };
