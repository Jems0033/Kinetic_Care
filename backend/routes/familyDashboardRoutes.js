const express = require("express");

const router = express.Router();

const {
    getFamilyDashboard,
    bookVisit
} = require("../controllers/familyDashboardController");

const protect = require("../middleware/authMiddleware");

router.get("/dashboard", protect, getFamilyDashboard);

router.post("/book-visit", protect, bookVisit);

module.exports = router;