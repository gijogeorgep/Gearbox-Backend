const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  username: String,
  password: String,
  confirmpassword: String,
  role: { type: String, enum: ["admin"], default: "admin" },
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = { Admin };
