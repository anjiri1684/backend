const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const Beat = require("../models/Beat");
const { verifyUserToken } = require("../middleware/authMiddleware");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Log the Stripe secret key for debugging purposes
console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);

// Purchase a beat
router.post("/purchase", verifyUserToken, async (req, res) => {
  try {
    const { beatId } = req.body;
    const userId = req.user.id;

    // Check if the beat exists
    const beat = await Beat.findById(beatId);
    if (!beat) {
      return res.status(404).json({ message: "Beat not found" });
    }

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: beat.price * 100, // price in cents
      currency: "usd",
      metadata: { userId, beatId },
    });

    // Save the payment record in the database
    const payment = new Payment({
      userId,
      beatId,
      amount: beat.price,
      stripePaymentIntentId: paymentIntent.id,
      paymentStatus: "pending",
    });
    await payment.save();

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: error.message });
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
