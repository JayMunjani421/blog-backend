const express = require("express");
const adminRoutes = express.Router();
const { loginAdmin, adminProfile } = require("../controllers/adminController");
const { verifyToken } = require("../middleware/auth");


adminRoutes.post("/login", loginAdmin);
adminRoutes.get("/profile", verifyToken, adminProfile);

module.exports = adminRoutes;
