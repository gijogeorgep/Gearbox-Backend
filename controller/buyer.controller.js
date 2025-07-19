const { Buyer } = require("../models/buyer.Model");
const bcrypt = require("bcryptjs");
const { OtpVerification } = require("../models/otpModel");
const jwt = require("jsonwebtoken");
const e = require("express");
const nodemailer = require("nodemailer");
async function name(params) {}

const sendOtp = async (req, res) => {
  try {
    console.log("A");

    const { name, username, email } = req.body;
    console.log(name, username, email);

    // Check if the email already exists in the Seller collection
    const existingBuyer = await Buyer.findOne({ email });
    console.log("A");
    if (existingBuyer) {
      return res.status(400).json({ msg: "Email already registered." });
    }
    console.log("A");
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
    return res.status(500);
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
    const existingBuyer = await Buyer.findOne({ email: email });
    if (existingBuyer) {
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

const createBuyer = async (req, res) => {
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

    const existingBuyer = await Buyer.findOne({ email });
    if (existingBuyer) {
      return res.status(400).json({ msg: "User already exists" });
    }

    if (password !== confirmPassword) {
      return res.status(401).json({ msg: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newBuyer = await Buyer.create({
      name,
      username,
      email,
      phone,
      password: hashedPassword,
      confirmpassword: hashedPassword,
    });

    console.log(newBuyer);
    return res
      .status(200)
      .json({ msg: "Account created successfully", Buyer: newBuyer });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error" });
  }
};

const loginWithPassword = async (req, res) => {
  try {
    const { username, password } = req.body;
    const doc = await Buyer.findOne({ username });
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

const editBuyerProfile = async (req, res) => {
  try {
    if (!req.buyer) {
      return res.status(401).json({ msg: "unauthorized" });
    }

    const { name, username, email, phone } = req.body;

    if (!name || !username || !email || !phone) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const updatedBuyer = await Buyer.findByIdAndUpdate(
      req.buyer._id,
      { name, username, email, phone },
      { new: true }
    );

    if (!updatedBuyer) {
      return res.status(404).json({ msg: "buyer not found" });
    }

    return res
      .status(200)
      .json({ msg: "Profile updated successfully", updatedBuyer });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "internal server error" });
  }
};

const getBuyerCount = async (req, res) => {
  try {
    const count = await Buyer.countDocuments();
    return res.status(200).json({ count });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "internal server error" });
  }
};

const BuyerProfile = async (req, res) => {
  try {
    if (!req.buyer) {
      return res.status(401).json({ msg: "unauthorized" });
    }

    console.log(req.buyer);

    const buyer = await Buyer.findById(req.buyer._id);
    if (!buyer) {
      return res.status(404).json({ msg: "buyer not found" });
    }

    return res.status(200).json({ msg: "buyer profile successul", buyer });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "internal server error" });
  }
};

const updateBuyerProfileImage = async (req, res) => {
  try {
    if (!req.buyer) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const { buyerProfileUrl } = req.body;

    if (!buyerProfileUrl) {
      return res.status(400).json({ msg: "Image URL is required" });
    }

    const updatedBuyer = await Buyer.findByIdAndUpdate(
      req.buyer._id,
      { buyerProfileUrl },
      { new: true }
    );

    return res
      .status(200)
      .json({ msg: "Profile image updated successfully", buyer: updatedBuyer });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};


module.exports = {
  sendOtp,
  verifyOtp,
  createBuyer,
  editBuyerProfile,
  loginWithPassword,
  getBuyerCount,
  BuyerProfile,
  updateBuyerProfileImage,
};
