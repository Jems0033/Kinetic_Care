const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    addRoom,
    getRooms,
    getRoomById,
    updateRoom,
    deleteRoom,
    getAvailableRooms,
} = require("../controllers/roomController");


router.get("/available", protect, getAvailableRooms);
// Get All Rooms
router.get("/", protect, getRooms);

// Get Room By ID
router.get("/:id", protect, getRoomById);

// Add Room
router.post("/", protect, addRoom);

// Update Room
router.put("/:id", protect, updateRoom);

// Delete Room
router.delete("/:id", protect, deleteRoom);

module.exports = router;