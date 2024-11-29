const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" }, // Role-based design
  subscription: {
    type: String,
    enum: ["Basic", "Standard", "Premium"], // Subscription options
    default: null, // No subscription by default
  },
});

module.exports = mongoose.model("User", userSchema);
