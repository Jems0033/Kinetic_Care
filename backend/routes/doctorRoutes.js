const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getDoctorPatients,
  getDoctorPatient,
  addMedicalRecord,
  getDoctorProfile,
  updateMedicalRecord,
  applyDoctorLeave
} = require("../controllers/doctorController");

router.get("/patients", protect, getDoctorPatients);
router.get("/profile", protect, getDoctorProfile);
router.post(
  "/leave/apply",
  protect,
  applyDoctorLeave
);
router.put("/medical/:id", protect, updateMedicalRecord);

router.get("/patient/:id", protect, getDoctorPatient);

router.post("/medical", protect, addMedicalRecord);
module.exports = router;
