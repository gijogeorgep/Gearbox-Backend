const express = require("express");
const {
  UploadProduct,
  getAllProduct,
  getProductById,
  getSellerProducts,
  getProductsCount,
  getProductItemTypes,
  getSellersWithProductsforAdmin,

  updateProduct,
} = require("../controller/product.controller");
const { Product } = require("../models/product.model");
const { authenticateSeller } = require("../middleware/auth");

const ProductRouter = express.Router();

ProductRouter.post("/create", authenticateSeller, UploadProduct);
ProductRouter.get("/all", getAllProduct);
ProductRouter.put("/update/:id", authenticateSeller, updateProduct);
ProductRouter.get("/seller/products", authenticateSeller, getSellerProducts);
ProductRouter.get("/count", getProductsCount);
ProductRouter.get("/itemtypes", getProductItemTypes);
ProductRouter.get("/sellerproducts-admin", getSellersWithProductsforAdmin);
ProductRouter.get("/:id", getProductById);

module.exports = { ProductRouter };
