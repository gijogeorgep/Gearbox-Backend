const express = require("express");
const {
  loginWithPassword,
  getBuyerCount,
  sendOtp,
  verifyOtp,
  createBuyer,
  BuyerProfile,
} = require("../controller/buyer.controller");
const { getProductById } = require("../controller/product.controller");
const { authenticateBuyer } = require("../middleware/auth");

const BuyerRouter = express.Router();
BuyerRouter.post("/sent-otp", sendOtp);
BuyerRouter.post("/verify-otp", verifyOtp);
BuyerRouter.post("/create", createBuyer);
BuyerRouter.post("/login", loginWithPassword);
BuyerRouter.get("/count", getBuyerCount);
BuyerRouter.get("/buyerprofile", authenticateBuyer, BuyerProfile);
BuyerRouter.get("/:id", getProductById);

module.exports = { BuyerRouter };
