const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getDoctorDashboard,
   getDoctorPatients,
    getDoctorPatient,
    addMedicalRecord,
    getDoctorProfile,
    updateMedicalRecord,
} = require("../controllers/doctorController");

router.get("/dashboard", protect, getDoctorDashboard);

router.get(
  "/patients",
  protect,
  getDoctorPatients
);
router.get(
    "/profile",
    protect,
    getDoctorProfile
);
router.put(
  "/medical/:id",
  protect,
  updateMedicalRecord
);

router.get("/patient/:id", protect, getDoctorPatient);

router.post("/medical", protect, addMedicalRecord);
module.exports = router;