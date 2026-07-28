const express = require("express");
const protect=require("../middleware/authMiddleware");

const router = express.Router();

const {
  getCaretakerDashboard,
  getResidentCare,
  saveDailyCare,
  getCaretakerProfile,
} = require("../controllers/caretakerController");

router.get("/dashboard", protect, getCaretakerDashboard);
router.get("/resident/:id", protect, getResidentCare);
router.post("/resident/:id", protect, saveDailyCare);
router.get("/profile",protect,getCaretakerProfile);

module.exports = router;