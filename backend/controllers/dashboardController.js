const Resident = require("../models/Resident");
const Staff = require("../models/Staff");
const Room = require("../models/Room");
const Donor = require("../models/Donor");
const Event = require("../models/Event");
const LeaveRequest = require("../models/LeaveRequest");
const {
  getResidentField,
  assignResidentsForLeave,
} = require("../utils/leaveReassignment");

const getDashboard = async (req, res) => {
  try {
    const totalResidents = await Resident.countDocuments({
      status: { $ne: "Discharged" },
    });

    const totalStaff = await Staff.countDocuments();

    const totalRooms = await Room.countDocuments();

    res.status(200).json({
      totalResidents,

      totalStaff,

      totalRooms,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const getLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find()
      .populate("staffId", "name phone shift role")
      .sort({ createdAt: -1 });

    res.status(200).json(leaveRequests);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const approveLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(
      req.params.id,
    ).populate("staffId");

    if (!leaveRequest) {
      return res.status(404).json({
        message: "Leave request not found",
      });
    }

    if (leaveRequest.status !== "Pending") {
      return res.status(400).json({
        message: `Leave request already ${leaveRequest.status}`,
      });
    }

    const leavingCaretaker = leaveRequest.staffId;

    if (!leavingCaretaker) {
      return res.status(404).json({
        message: "Caretaker not found",
      });
    }

    const residentField = getResidentField(
    leaveRequest.staffRole,
    leavingCaretaker.shift
);

    const residents = await Resident.find({
      [residentField]: leavingCaretaker._id,
      status: "Active",
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const leaveIsActiveToday =
      leaveRequest.fromDate < tomorrowStart &&
      leaveRequest.toDate >= todayStart;

    let replacements = [];

    if (leaveIsActiveToday && residents.length > 0) {
      try {
        replacements = await assignResidentsForLeave(leaveRequest);
      } catch (assignmentError) {
        return res.status(400).json({
          message: assignmentError.message,
        });
      }
    }

    leaveRequest.status = "Approved";
    leaveRequest.approvedBy = req.user.id;
    leaveRequest.approvedAt = new Date();
    await leaveRequest.save();

    res.status(200).json({
      message:
        "Leave approved and residents reassigned successfully",
      reassignedResidents: replacements.length,
    });
  } catch (error) {
    console.log("Approve Leave Error:", error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const rejectLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(
      req.params.id,
    );

    if (!leaveRequest) {
      return res.status(404).json({
        message: "Leave request not found",
      });
    }

    if (leaveRequest.status !== "Pending") {
      return res.status(400).json({
        message: `Leave request already ${leaveRequest.status}`,
      });
    }

    leaveRequest.status = "Rejected";
    leaveRequest.approvedBy = req.user.id;
    leaveRequest.approvedAt = new Date();

    await leaveRequest.save();

    res.status(200).json({
      message: "Leave request rejected successfully",
    });
  } catch (error) {
    console.log("Reject Leave Error:", error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboard,
  getLeaveRequests,
  approveLeaveRequest,
  rejectLeaveRequest,
};
