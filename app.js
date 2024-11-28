const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const authRoutes = require("./routes/authRoutes");
const beatRoutes = require("./routes/beatRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");

dotenv.config();
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const apiRoutes = [
  { path: "/api/auth", route: authRoutes },
  { path: "/api/beats", route: beatRoutes },
  { path: "/api/payments", route: paymentRoutes },
  { path: "/api/subscription", route: subscriptionRoutes },
  { path: "/api/favorites", route: favoriteRoutes },
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
