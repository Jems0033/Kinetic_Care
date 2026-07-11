const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    addEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent
} = require("../controllers/eventController");

// Get All Events
router.get("/", protect, getEvents);

// Get Event By Id
router.get("/:id", protect, getEventById);

// Add Event
router.post("/", protect, addEvent);

// Update Event
router.put("/:id", protect, updateEvent);

// Delete Event
router.delete("/:id", protect, deleteEvent);

module.exports = router;