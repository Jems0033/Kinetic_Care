const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const { getDashboard,getLeaveRequests,approveLeaveRequest,rejectLeaveRequest, } = require("../controllers/dashboardController");

router.get("/", protect, getDashboard);
router.get(
  "/leave-requests",
  protect,
  getLeaveRequests,
);
router.put(
  "/leave-requests/:id/approve",
  protect,
  approveLeaveRequest,
);

router.put(
  "/leave-requests/:id/reject",
  protect,
  rejectLeaveRequest,
);

module.exports = router;
