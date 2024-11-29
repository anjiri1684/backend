const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const createPaymentIntent = async (amount) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    return paymentIntent;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw new Error("Payment creation failed");
  }
};

// Verify a payment intent (optional, depending on your payment flow)
const verifyPaymentIntent = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error("Error retrieving payment intent:", error);
    throw new Error("Payment verification failed");
  }
};

module.exports = {
  createPaymentIntent,
  verifyPaymentIntent,
};
