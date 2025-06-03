const { Admin } = require("../models/admin.model");
const bcrypt = require("bcrypt");
const e = require("express");
const jwt = require("jsonwebtoken");

const adminSignUp = async (req, res) => {
  try {
    const { name, username, email, password, confirmPassword } = req.body;
    const doc = await Admin.findOne({ email });
    if (doc) {
      return res.status(400).json({ msg: "user already exist", doc });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      name,
      username,
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
    });
    return res.status(201).json({ msg: "Admin created succesfuly", newAdmin });
  } catch (error) {
    console.log(error);
  }
};

const loginWithPassword = async (req, res) => {
  try {
    const { username, password } = req.body;
    const doc = await Admin.findOne({ username });
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

const getProfileFromToken = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "internal server error" });
  }
};

module.exports = { adminSignUp, loginWithPassword, getProfileFromToken };

