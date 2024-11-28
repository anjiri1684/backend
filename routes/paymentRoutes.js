const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const Beat = require("../models/Beat");
const { verifyUserToken } = require("../middleware/authMiddleware");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      message: "Payment initiated successfully.",
    });
  } catch (error) {
    console.error("Error during purchase:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// View payment history
router.get("/history", verifyUserToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const payments = await Payment.find({ userId }).populate(
      "beatId",
      "title price"
    );
    res.status(200).json({ payments });
  } catch (error) {
    console.error("Error fetching payment history:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Stripe webhook for payment confirmation
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    const sig = req.headers["stripe-signature"];

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        endpointSecret
      );

      // Handle successful payment
      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        const payment = await Payment.findOneAndUpdate(
          { stripePaymentIntentId: paymentIntent.id },
          { paymentStatus: "completed" },
          { new: true }
        );
        console.log("Payment succeeded:", payment);
      }

      res.status(200).send("Webhook received.");
    } catch (error) {
      console.error("Webhook error:", error.message);
      res.status(400).send(`Webhook error: ${error.message}`);
    }
  }
);

module.exports = router;
