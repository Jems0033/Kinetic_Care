const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  addResident,
  getResidents,
  getResidentById,
  updateResident,
  deleteResident,
  getRecentResidents,
} = require("../controllers/residentController");

// Create
router.post("/", addResident);

router.get("/recent", protect, getRecentResidents);
// Read All
router.get("/", getResidents);

// Read Single
router.get("/:id", getResidentById);

// Update
router.put("/:id", updateResident);

// Delete
router.delete("/:id", deleteResident);


module.exports = router;