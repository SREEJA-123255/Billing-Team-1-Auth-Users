require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const businessRoutes = require("./routes/businessRoutes");
const {
  notFound,
  errorHandler
} = require("./middleware/errorMiddleware");
const User = require("./models/User");
const Business = require("./models/Business");

const app = express();

// Connect to MongoDB
connectDB();

// Ensure uploads/logos directory exists
const uploadDir = path.join(__dirname, "uploads/logos");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// System Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Billing System API (Team 1 - Auth, Users & Business) is operational",
    timestamp: new Date().toISOString()
  });
});

// Team 1 API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/business", businessRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Billing Software API Server - Team 1 Active");
});

// Initialize default admin and business profile
const initDefaultData = async () => {
  try {
    const adminEmail = (
      process.env.ADMIN_EMAIL || "admin@example.com"
    )
      .toLowerCase()
      .trim();

    const adminPassword =
      process.env.ADMIN_PASSWORD || "Admin@123";

    const adminName =
      process.env.ADMIN_NAME || "System Administrator";

    const adminPhone =
      process.env.ADMIN_PHONE || "+91 9876543210";

    const existingAdmin = await User.findOne({
      email: adminEmail
    });

    if (!existingAdmin) {
      console.log(`Creating default admin (${adminEmail})...`);

      await User.create({
        name: adminName,
        email: adminEmail,
        phone: adminPhone,
        password: adminPassword,
        role: "ADMIN",
        status: "ACTIVE"
      });

      console.log(`Default Admin initialized: ${adminEmail}`);
    }

    // Ensure business profile exists
    await Business.getOrCreateProfile();
  } catch (err) {
    console.error(
      "Initialization check error:",
      err.message
    );
  }
};

initDefaultData();

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Server configuration
const PORT = Number(process.env.PORT) || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Billing System Backend running on port ${PORT}`
  );
});

// Handle server startup errors
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `ERROR: Port ${PORT} is already in use.`
    );
    console.error(
      "The backend may already be running in another terminal."
    );
    console.error(
      "Check the existing process or configure a different PORT in .env."
    );

    process.exitCode = 1;
    return;
  }

  console.error("Backend server error:", err);
  process.exitCode = 1;
});

module.exports = app;