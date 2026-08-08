const LeaveRequest = require("../models/LeaveRequest");

const {
  assignResidentsForLeave,
  restoreResidentsAfterLeave,
} = require("../utils/leaveReassignment");

const processLeaves = async (shift) => {
  try {
    const now = new Date();

    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    // ==========================================
    // 1. LEAVE START
    // ==========================================

    const startingLeaves = await LeaveRequest.find({
      status: "Approved",

      fromDate: {
        $gte: todayStart,
        $lt: tomorrowStart,
      },

      reassignmentCompleted: false,
    }).populate("staffId");

    for (const leaveRequest of startingLeaves) {
      try {
        // Staff exist check
        if (!leaveRequest.staffId) {
          console.log(
            `Staff not found for leave ${leaveRequest._id}`,
          );
          continue;
        }

        // Only process requested shift
        if (leaveRequest.staffId.shift !== shift) {
          continue;
        }

        await assignResidentsForLeave(leaveRequest);

        console.log(
          `${shift} shift leave started: ${leaveRequest._id}`,
        );
      } catch (assignmentError) {
        console.log(
          `Leave assignment failed for ${leaveRequest._id}:`,
          assignmentError.message,
        );
      }
    }

    // ==========================================
    // 2. LEAVE END / RESTORATION
    // ==========================================

    const endingLeaves = await LeaveRequest.find({
      status: "Approved",

      toDate: {
        $lt: todayStart,
      },

      reassignmentCompleted: true,

      restorationCompleted: false,
    }).populate("staffId");

    for (const leaveRequest of endingLeaves) {
      try {
        // Staff exist check
        if (!leaveRequest.staffId) {
          console.log(
            `Staff not found for leave ${leaveRequest._id}`,
          );
          continue;
        }

        // Only process requested shift
        if (leaveRequest.staffId.shift !== shift) {
          continue;
        }

        await restoreResidentsAfterLeave(leaveRequest);

        console.log(
          `${shift} shift leave restored: ${leaveRequest._id}`,
        );
      } catch (restoreError) {
        console.log(
          `Leave restoration failed for ${leaveRequest._id}:`,
          restoreError.message,
        );
      }
    }
  } catch (error) {
    console.log(
      "Process Leave Error:",
      error,
    );
  }
};

module.exports = processLeaves;