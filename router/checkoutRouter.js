const express = require("express");
const {
  verifyPayment,
  createRazorPayOrder,
} = require("../controller/checkout.controller");

const CheckoutRouter = express.Router();

CheckoutRouter.post("/createOrder", createRazorPayOrder);
CheckoutRouter.post("/verifyPayment", verifyPayment);

module.exports = { CheckoutRouter };
