const express = require("express");
const router = express.Router();

const {
  getFamilyDashboard,
} = require("../controllers/familyDashboardController");

const protect = require("../middleware/authMiddleware");

router.get("/dashboard", protect, getFamilyDashboard);

module.exports = router;