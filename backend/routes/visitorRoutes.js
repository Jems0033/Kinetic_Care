const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    addVisitor,
    getVisitors,
    getVisitorById,
    updateVisitor,
    deleteVisitor,
    checkOutVisitor,
} = require("../controllers/visitorController");

router.get("/", protect, getVisitors);

router.put("/checkout/:id", protect, checkOutVisitor);

router.get("/:id", protect, getVisitorById);

router.post("/", protect, addVisitor);

router.put("/:id", protect, updateVisitor);

router.delete("/:id", protect, deleteVisitor);

module.exports = router;