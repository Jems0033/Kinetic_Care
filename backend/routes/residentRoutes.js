const express = require("express");
const router = express.Router();

const {
  addResident,
  getResidents,
  getResidentById,
  updateResident,
  deleteResident,
} = require("../controllers/residentController");

// Create
router.post("/", addResident);

// Read All
router.get("/", getResidents);

// Read Single
router.get("/:id", getResidentById);

// Update
router.put("/:id", updateResident);

// Delete
router.delete("/:id", deleteResident);

module.exports = router;