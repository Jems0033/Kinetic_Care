const LeaveRequest = require("../models/LeaveRequest");
const {
  assignResidentsForLeave,
  restoreResidentsAfterLeave,
} = require("../utils/leaveReassignment");

const processLeaves = async () => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

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
        await assignResidentsForLeave(leaveRequest);
      } catch (assignmentError) {
        console.log(
          `Leave assignment failed for ${leaveRequest._id}:`,
          assignmentError.message,
        );
      }
    }

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
        await restoreResidentsAfterLeave(leaveRequest);
      } catch (restoreError) {
        console.log(
          `Leave restoration failed for ${leaveRequest._id}:`,
          restoreError.message,
        );
      }
    }
  } catch (error) {
    console.log(
      "Process Caretaker Leave Error:",
      error,
    );
  }
};

module.exports = processLeaves;