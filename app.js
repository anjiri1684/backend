const dotenv = require("dotenv"); // Ensure dotenv is required at the top
dotenv.config();

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

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"], // Allow both ports
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

const apiRoutes = [
  { path: "/api/auth", route: authRoutes },
  { path: "/api/beats", route: beatRoutes },
  { path: "/api/payments", route: paymentRoutes },
  { path: "/api/subscription", route: subscriptionRoutes },
  { path: "/api/favorites", route: favoriteRoutes },
  { path: "/api/admin", route: adminRoutes },
];

apiRoutes.forEach((route) => app.use(route.path, route.route));

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Database connection error:", err));

module.exports = app;
