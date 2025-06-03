const express = require("express");
const {
  loginWithPassword,
  getSellerCount,
  sellerProfile,
  verifyOtp,
  sendOtp,
  createSeller,
  getAllSellers,
} = require("../controller/seller.controller");
const { authenticateSeller } = require("../middleware/auth");

const SellerRouter = express.Router();
SellerRouter.post("/sent-otp", sendOtp);
SellerRouter.post("/verify-otp", verifyOtp);
SellerRouter.post("/create", createSeller);
SellerRouter.post("/login", loginWithPassword);
SellerRouter.get("/count", getSellerCount);
SellerRouter.get("/allseller", getAllSellers);
SellerRouter.get("/sellerprofile", authenticateSeller, sellerProfile);

module.exports = { SellerRouter };
