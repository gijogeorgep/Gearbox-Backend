const mongoose = require("mongoose");
require("dotenv").config();

const connectDb = () => {
  mongoose
    .connect(process.env.CONN_STRING)
    .then(() => {
      console.log("connected to db");
    })
    .catch((error) => {
      console.log("database connection error");
      console.log(error);
    });
};

module.exports = { connectDb };
