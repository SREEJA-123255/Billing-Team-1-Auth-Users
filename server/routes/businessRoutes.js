const express = require("express");
const router = express.Router();
const {
  getBusiness,
  updateBusiness
} = require("../controllers/businessController");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");
const uploadLogo = require("../middleware/uploadMiddleware");
const {
  validateBusinessSettings
} = require("../middleware/validationMiddleware");

// GET /api/business - Accessible to all authenticated users (Team 1, Team 4 for invoices, etc.)
router.get("/", authenticate, getBusiness);

// PUT /api/business - Only ADMIN can update business settings and logo
router.put(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
  uploadLogo.single("logo"),
  validateBusinessSettings,
  updateBusiness
);

module.exports = router;
