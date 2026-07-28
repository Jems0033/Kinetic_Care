const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    getMedicalRecords,
    getMedicalRecordById
} = require("../controllers/medicalController");

// Get All Medical Records
router.get("/", protect, getMedicalRecords);

// Get Medical Record By ID
router.get("/:id", protect, getMedicalRecordById);

module.exports = router;