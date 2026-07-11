const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    addMedicalRecord,
    getMedicalRecords,
    getMedicalRecordById,
    updateMedicalRecord,
    deleteMedicalRecord
} = require("../controllers/medicalController");

// Get All Medical Records
router.get("/", protect, getMedicalRecords);

// Get Medical Record By ID
router.get("/:id", protect, getMedicalRecordById);

// Add Medical Record
router.post("/", protect, addMedicalRecord);

// Update Medical Record
router.put("/:id", protect, updateMedicalRecord);

// Delete Medical Record
router.delete("/:id", protect, deleteMedicalRecord);

module.exports = router;