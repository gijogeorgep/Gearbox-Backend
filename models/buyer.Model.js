const mongoose = require("mongoose");
const buyerSchema = new mongoose.Schema({
  name: String,
  email: String,
  username: String,
  phone: Number,
  password: String,
  confirmpassword: String,
  profileImage: String,
  role: { type: String, enum: ["buyer"], default: "buyer" },
});

const Buyer = mongoose.model("Buyer", buyerSchema);

module.exports = { Buyer };
