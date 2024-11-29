const express = require("express");
const router = express.Router();
const { verifyAdminToken } = require("../middleware/authMiddleware");
const User = require("../models/User");
const { getTotalRevenue } = require("../controllers/adminController");

// Get all users
router.get("/customers", verifyAdminToken, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Get revenue with the admin verification middleware
// router.get("/admin/revenue", verifyAdminToken, getTotalRevenue);
router.get("/admin/revenue", verifyAdminToken, getTotalRevenue);

module.exports = router;
