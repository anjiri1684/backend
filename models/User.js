const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" }, // Changed to 'role'
  subscription: {
    type: String,
    enum: ["Basic", "Standard", "Premium"],
    default: null,
  },
});

module.exports = mongoose.model("User", userSchema);
