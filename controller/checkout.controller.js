const express = require("express");
const { Checkout } = require("../models/checkoutProduct.model");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const { rentRequest } = require("../models/rentRequest.model");

const razorpay = new Razorpay({
  key_id: "rzp_test_QgNiku4DkATwmt", // Ensure test key is used
  key_secret: "Hs4PDuQPoPXJJovOsquHZrXr",
});

const createRazorPayOrder = async (req, res) => {
  try {
    const { rentRequestId, ProductId, amount } = req.body;

    if (!rentRequestId || !ProductId || !amount) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const options = {
      amount: Math.round(amount), // Amount should already be in paise from frontend
      currency: "INR",
      receipt: `receipt_${rentRequestId}`,
    };

    const order = await razorpay.orders.create(options);

    return res.status(201).json({
      msg: "Order created successfully",
      orderId: order.id,
      amount: options.amount,
      currency: options.currency,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      rentRequestId,
      ProductId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ msg: "Missing payment details" });
    }

    const generateSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`) // Removed space around |
      .digest("hex");

    if (generateSignature !== razorpay_signature) {
      return res.status(400).json({ msg: "Invalid payment signature" });
    }

    const newCheckout = await Checkout.create({
      rentRequestId,
      ProductId,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: "captured",
    });

    await rentRequest.findByIdAndUpdate(
      rentRequestId,
      { status: "Booked", paymentStatus: "Paid" },
      { new: true }
    );

    res.status(201).json({ message: "Checkout created", data: newCheckout });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { verifyPayment, createRazorPayOrder };
