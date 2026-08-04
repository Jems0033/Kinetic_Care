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

router.post("/", protect, addResident);

router.get("/recent", protect, getRecentResidents);

router.get("/", protect, getResidents);

router.get("/:id", protect, getResidentById);

router.put("/:id", protect, updateResident);

router.delete("/:id", protect, deleteResident);

module.exports = router;
