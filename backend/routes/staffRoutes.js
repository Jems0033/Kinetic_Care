const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    addStaff,
    getStaff,
    getStaffById,
    updateStaff,
    deleteStaff,
    getDoctors,
    getStaffDashboard,
    getStaffResidents,
    getStaffResidentById,
    updateVitals,
    giveMedicine,
    getResidentHistory,
} = require("../controllers/staffController");

router.get("/dashboard", protect, getStaffDashboard);

router.get("/doctors", protect, getDoctors);

router.get("/residents", protect, getStaffResidents);

router.get("/resident/:id", protect, getStaffResidentById);

router.post("/resident/:id/vitals",protect,updateVitals);
router.post(
  "/resident/:id/medicine",
  protect,
  giveMedicine
);
router.get(
    "/resident/:id/history",
    protect,
    getResidentHistory
);
router.get("/", protect, getStaff);

router.get("/:id", protect, getStaffById);

router.post("/", protect, addStaff);

router.put("/:id", protect, updateStaff);

router.delete("/:id", protect, deleteStaff);

module.exports = router;