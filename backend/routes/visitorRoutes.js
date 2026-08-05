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
  bookVisit,
  approveVisitor,
  rejectVisitor,
} = require("../controllers/visitorController");

router.get("/", protect, getVisitors);

router.post("/book", protect, bookVisit);

router.put("/approve/:id", protect, approveVisitor);

router.put("/reject/:id", protect, rejectVisitor);

router.put("/checkout/:id", protect, checkOutVisitor);

router.post("/", protect, addVisitor);

router.get("/:id", protect, getVisitorById);

router.put("/:id", protect, updateVisitor);

router.delete("/:id", protect, deleteVisitor);
module.exports = router;
