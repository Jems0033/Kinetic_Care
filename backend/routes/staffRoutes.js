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
} = require("../controllers/staffController");

router.get("/doctors", protect, getDoctors);

router.get("/", protect, getStaff);

router.get("/:id", protect, getStaffById);

router.post("/", protect, addStaff);

router.put("/:id", protect, updateStaff);

router.delete("/:id", protect, deleteStaff);

module.exports = router;