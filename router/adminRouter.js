const express = require("express");
const {
  adminSignUp,
  loginWithPassword,
  getProfileFromToken,
} = require("../controller/admin.controller");

const AdminRouter = express.Router();

AdminRouter.post("/create", adminSignUp);
AdminRouter.post("/login", loginWithPassword);
AdminRouter.get("/home", getProfileFromToken);
module.exports = { AdminRouter };
