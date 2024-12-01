const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const Beat = require("../models/Beat");
const { verifyUserToken } = require("../middleware/authMiddleware");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Log the Stripe secret key for debugging purposes
console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);

// Purchase a beat
const { createPaymentIntent } = require("../config/stripe");

// Create a payment intent
router.post("/create-payment-intent", async (req, res) => {
  console.log("Request received at /create-payment-intent"); // Log route hit

  const { beatIds } = req.body;
  console.log("Received beatIds:", beatIds); // Log received beat IDs

  if (!beatIds || !Array.isArray(beatIds)) {
    console.log("Invalid beatIds provided:", beatIds); // Log if beatIds is invalid
    return res.status(400).json({ error: "Invalid beat IDs provided." });
  }

  const beats = await Beat.find({ _id: { $in: beatIds } });
  console.log("Beats fetched:", beats); // Log the fetched beats

  if (!beats || beats.length === 0) {
    console.log("No beats found for IDs:", beatIds); // Log if no beats found
    return res
      .status(404)
      .json({ error: "No beats found for the provided IDs." });
  }

  const totalPrice = beats.reduce((sum, beat) => sum + beat.price, 0);
  console.log("Total price calculated:", totalPrice); // Log the total price

  try {
    const paymentIntent = await createPaymentIntent(totalPrice);
    console.log("Payment Intent created:", paymentIntent); // Log the created payment intent

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      beats,
      totalPrice,
    });
  } catch (error) {
    console.error("Error during payment intent creation:", error); // Log error if payment creation fails
    res.status(500).json({ error: "Payment creation failed." });
  }
});

router.get("/revenue", async (req, res) => {
  try {
    const totalRevenue = await Payment.aggregate([
      { $match: { paymentStatus: "completed" } }, // Only completed payments
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
    ]);

    // If no payments exist or no completed payments
    const revenue = totalRevenue[0] ? totalRevenue[0].totalRevenue : 0;
    res.status(200).json({ revenue });
  } catch (error) {
    console.error("Error fetching revenue:", error);
    res.status(500).json({ message: "Error fetching revenue." });
  }
});

// View payment history
router.get("/history", verifyUserToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const payments = await Payment.find({ userId })
      .populate("beatId", "title price") // Populate beat details (title and price)
      .exec(); // Ensures the query is executed properly
    res.status(200).json({ payments });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
