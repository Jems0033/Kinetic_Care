const express = require("express");
const router = express.Router();

const {
  getFamilyDashboard,
  getProfile,
} = require("../controllers/familyDashboardController");

const protect = require("../middleware/authMiddleware");

router.get("/dashboard", protect, getFamilyDashboard);
router.get("/profile", protect, getProfile);

module.exports = router;
