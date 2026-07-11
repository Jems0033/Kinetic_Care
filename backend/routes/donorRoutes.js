const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    addDonor,
    getDonors
} = require("../controllers/donorController");

// Public Route (No Login Required)
router.post("/", addDonor);

// Admin Route (Login Required)
router.get("/", protect, getDonors);

module.exports = router;