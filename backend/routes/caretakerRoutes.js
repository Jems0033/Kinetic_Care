const express = require("express");
const protect=require("../middleware/authMiddleware");

const router = express.Router();

const {
  getCaretakerDashboard,
  getResidentCare,
  saveDailyCare,
} = require("../controllers/caretakerController");

router.get("/dashboard", protect, getCaretakerDashboard);
router.get("/resident/:id", protect, getResidentCare);
router.post("/resident/:id", protect, saveDailyCare);

module.exports = router;