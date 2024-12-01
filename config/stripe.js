const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Create a payment intent
const createPaymentIntent = async (amount, metadata = {}) => {
  try {
    console.log(
      "Creating payment intent with amount:",
      amount,
      "and metadata:",
      metadata
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to the smallest currency unit (cents)
      currency: "usd", // Adjust as per your currency needs
      automatic_payment_methods: { enabled: true },
      metadata, // Optional metadata like beat IDs, user info, etc.
    });

    console.log("Payment intent created successfully:", paymentIntent.id);
    return paymentIntent;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    // Provide more details in the error for better diagnostics
    throw new Error(`Payment creation failed: ${error.message || error}`);
  }
};

// Verify a payment intent (optional, depending on your payment flow)
const verifyPaymentIntent = async (paymentIntentId) => {
  try {
    console.log("Verifying payment intent with ID:", paymentIntentId);

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    console.log("Payment intent verified:", paymentIntent.status);
    // Return only necessary info
    return {
      status: paymentIntent.status,
      paymentMethod: paymentIntent.payment_method,
    };
  } catch (error) {
    console.error("Error retrieving payment intent:", error);
    // Again, provide more details in the error
    throw new Error(`Payment verification failed: ${error.message || error}`);
  }
};

module.exports = {
  createPaymentIntent,
  verifyPaymentIntent,
};
