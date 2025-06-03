const { Buyer } = require("../models/buyer.Model");
const { Product } = require("../models/product.model");
const { rentRequest } = require("../models/rentRequest.model");

const sendRentRequest = async (req, res) => {
  try {
    const {
      productId,
      name,
      email,
      sellerEmail,
      phoneNumber,
      location,
      startDate,
      endDate,
    } = req.body;

    // Use req.buyer._id from authenticateBuyer middleware
    if (!req.buyer) {
      return res.status(401).json({ msg: "Unauthorized: Buyer not found" });
    }

    const product = await Product.findById(productId);
    console.log(product);

    if (!product) {
      return res.status(404).json({ msg: "Product or seller not found" });
    }

    const newRequest = await rentRequest.create({
      product: product._id, // Use authenticated buyer's ID
      name,
      email,
      sellerEmail,
      phoneNumber,
      location,
      startDate,
      endDate,
    });

    return res.status(200).json({ msg: "Rent request successful", newRequest });
  } catch (error) {
    console.error("Rent Request Error:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const getRentrequest = async (req, res) => {
  try {
    const request = await rentRequest.find().populate("product");
    console.log(request);
    return res.status(200).json({ request });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "internal server error" });
  }
};

const getRentrequestForBuyer = async (req, res) => {
  try {
    if (!req.buyer) {
      return res.status(400).json({ msg: "unauthorized" });
    }
    const email = req.buyer.email;

    const requests = await rentRequest.find({ email }).populate("product");

    if (!requests) {
      return res.status(401).json({ msg: "email not found" });
    }

    return res.status(200).json(requests);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "internal server error" });
  }
};

const getRentRequestForSeller = async (req, res) => {
  try {
    if (!req.seller) {
      return res.status(400).json({ msg: "unauthorized" });
    }

    const sellerEmail = req.seller.email;
    console.log(sellerEmail);

    // Get all rent requests and populate the product
    const sellerRequests = await rentRequest
      .find({ sellerEmail: sellerEmail })
      .populate("product");
    console.log("seller:", sellerRequests);

    return res.status(200).json(sellerRequests);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "internal server error" });
  }
};

const updateRequest = async (req, res) => {
  const { status } = req.body;
  try {
    const updated = await rentRequest.findByIdAndUpdate(req.params.id, {
      status,
    });
    return res.status(200).json({ msg: "requuest updated", updated });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "internal server error" });
  }
};

const countrequest = async (req, res) => {
  try {
    const { sellerEmail } = req.body;

    if (!sellerEmail) {
      return res.status(400).json({ error: "Email is required." });
    }

    const count = await rentRequest.countDocuments({
      sellerEmail: sellerEmail,
    });

    res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while counting requests." });
  }
};
module.exports = {
  sendRentRequest,
  getRentrequest,
  getRentrequestForBuyer,
  getRentRequestForSeller,
  updateRequest,
  countrequest,
};
