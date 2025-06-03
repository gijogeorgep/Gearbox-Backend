const mongoose = require("mongoose");

const otpVerificationSchema = new mongoose.Schema({
  name: String,
  email: String,
  username: String,// hashed
  otp: String,
  createdAt: { type: Date, default: Date.now, expires: 300 }, // expires in 5 minutes
});

const OtpVerification = mongoose.model(
  "OtpVerification",
  otpVerificationSchema
);

module.exports = { OtpVerification };
