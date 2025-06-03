const { Seller } = require("../models/seller.model");
const { OtpVerification } = require("../models/otpModel");
const bcrypt = require("bcrypt");
const e = require("express");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const sendOtp = async (req, res) => {
  try {
    console.log("A");

    const { name, username, email } = req.body;
    // Check if the email already exists in the Seller collection
    const existingSeller = await Seller.findOne({ email });

    if (existingSeller) {
      return res.status(400).json({ msg: "Email already registered." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email - Camera Rental App",
      text: `Your OTP code is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    // Save OTP record to the database
    await OtpVerification.create({
      name,
      username,
      email,
      otp,
    });

    console.log(otp);

    return res.status(200).json({ msg: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find the OTP record in the database
    const otpRecord = await OtpVerification.findOne({ email: email, otp: otp });
    if (!otpRecord) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    // Check if the email is already registered as a seller
    const existingSeller = await Seller.findOne({ email: email });
    if (existingSeller) {
      return res
        .status(400)
        .json({ msg: "Email already registered as a seller" });
    }

    const { name, username, phone, password } = otpRecord;

    // Delete OTP record after successful account creation
    await OtpVerification.deleteOne({ _id: otpRecord._id });

    return res.status(201).json({ msg: "Email verified " });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error" });
  }
};

const createSeller = async (req, res) => {
  try {
    const { name, username, email, phone, password, confirmPassword } =
      req.body;

    if (
      !name ||
      !username ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ msg: "User already exists" });
    }

    if (password !== confirmPassword) {
      return res.status(401).json({ msg: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newSeller = await Seller.create({
      name,
      username,
      email,
      phone,
      password: hashedPassword,
      confirmpassword: hashedPassword,
    });

    console.log(newSeller);
    return res
      .status(200)
      .json({ msg: "Account created successfully", seller: newSeller });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error" });
  }
};

const loginWithPassword = async (req, res) => {
  try {
    const { username, password } = req.body;
    const doc = await Seller.findOne({ username });
    if (!doc) {
      return res.status(400).json({ msg: "account not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, doc.password);
    if (!isPasswordValid) {
      return res.status(400).json({ msg: "incorrect password" });
    }
    const token = jwt.sign({ id: doc._id }, process.env.JWT_SECRET);
    return res.status(200).json({ msg: "login succesfull", token, doc });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "internal server error" });
  }
};

const getSellerCount = async (req, res) => {
  try {
    const count = await Seller.countDocuments();
    return res.status(200).json({ count });
  } catch (error) {
    console.error("Error counting sellers:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const sellerProfile = async (req, res) => {
  try {
    if (!req.seller) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    console.log("Decoded Seller from middleware:", req.seller);

    const seller = await Seller.findById(req.seller._id);
    if (!seller) {
      return res.status(404).json({ msg: "Seller not found" });
    }

    res.status(200).json(seller);
  } catch (error) {
    console.error("Error in sellerProfile:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find({});
    res.status(200).json({ sellers });
  } catch (error) {
    console.error("Error fetching sellers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  createSeller,
  loginWithPassword,
  getSellerCount,
  sellerProfile,
  getAllSellers,
};
