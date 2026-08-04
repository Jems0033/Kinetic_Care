const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getMedicalRecords,
  getMedicalRecordById,
} = require("../controllers/medicalController");

router.get("/", protect, getMedicalRecords);

router.get("/:id", protect, getMedicalRecordById);

module.exports = router;
