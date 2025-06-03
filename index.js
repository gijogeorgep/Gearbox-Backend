const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = process.env.port || 4000;
const { AdminRouter } = require("./router/adminRouter");
const { connectDb } = require("./config/db");
const { SellerRouter } = require("./router/sellerRouter");
const { BuyerRouter } = require("./router/buyerRouter");
const { ProductRouter } = require("./router/productRouter");
const { rentRequestRouter } = require("./router/rentRequestRouter");
const { CheckoutRouter } = require("./router/checkoutRouter");

require("dotenv").config();
app.use(cors());
app.use(express.json());
connectDb();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/admin", AdminRouter);
app.use("/api/seller/", SellerRouter);
app.use("/api/buyer/", BuyerRouter);
app.use("/api/product/", ProductRouter);
app.use("/api/rentrequest/", rentRequestRouter);
app.use("/api/checkout/", CheckoutRouter);

app.listen(port, () => {
  console.log("server running on http://localhost:4000");
});
