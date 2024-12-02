const express = require("express");
const {
  registerUser,
  loginUser,
  registerAdmin,
  loginAdmin,
} = require("../controllers/authController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/register-admin", registerAdmin);
router.post("/login-admin", loginAdmin);

module.exports = router;
