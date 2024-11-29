const express = require("express");
const {
  registerUser,
  loginUser,
  registerAdmin,
  loginAdmin,
} = require("../controllers/authController");
const router = express.Router();

// Register Admin Route
router.post("/register-admin", registerAdmin);
router.post("/login-admin", loginAdmin);

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
