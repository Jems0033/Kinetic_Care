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

router.get("/", protect, getRooms);

router.get("/:id", protect, getRoomById);

router.post("/", protect, addRoom);

router.put("/:id", protect, updateRoom);

router.delete("/:id", protect, deleteRoom);

module.exports = router;
