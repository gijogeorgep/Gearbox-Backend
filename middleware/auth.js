const jwt = require("jsonwebtoken");
const { Admin } = require("../models/admin.model");
const { Seller } = require("../models/seller.model");
const { Buyer } = require("../models/buyer.Model");

const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ msg: "unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        return res.status(400).json({ msg: "invalid token" });
      }
      const doc = await Admin.findById(decodedToken.id);
      req.user = doc;
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "internal server error " });
  }
};

const authenticateSeller = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ msg: "Unauthorized: No token provided" });
    }
    console.log(authHeader);

    const sellertoken = authHeader.split(" ")[1];

    jwt.verify(
      sellertoken,
      process.env.JWT_SECRET,
      async (err, decodedToken) => {
        if (err || !decodedToken?.id) {
          return res.status(400).json({ msg: "Invalid or expired token" });
        }

        const doc = await Seller.findById(decodedToken.id);
        if (!doc) {
          return res.status(404).json({ msg: "Seller not found" });
        }

        req.seller = doc;

        next();
      }
    );
  } catch (error) {
    console.log("Auth error:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const authenticateBuyer = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ msg: "unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        return res.status(400).json({ msg: "invalid token" });
      }
      const doc = await Buyer.findById(decodedToken.id);
      req.buyer = doc;
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "internal server error" });
  }
};

module.exports = {
  authenticateAdmin,
  authenticateSeller,
  authenticateBuyer,
};
