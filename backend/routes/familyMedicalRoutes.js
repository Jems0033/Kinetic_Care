const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getMedicalHistory,
} = require("../controllers/familyMedicalController");

router.get("/medical-history", protect, getMedicalHistory);

module.exports = router;