require("dotenv").config(); // Ensure dotenv is required first
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const beatRoutes = require("./routes/beatRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const favoriteRoutes = require("./routes/favoritesRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const app = express();
const path = require("path");

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"], // Allow both ports
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/beats", beatRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/checkout", paymentRoutes);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack);
  res.status(500).json({ message: "Internal server error" });
});

app.get("/test", (req, res) => {
  console.log("Test route hit");
  res.send("Test successful");
});

app.use((req, res, next) => {
  console.log(`[Middleware] ${req.method} ${req.url}`); // Logs each request
  next();
});

module.exports = app;
