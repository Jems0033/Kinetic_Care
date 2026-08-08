const Resident = require("../models/Resident");
const Staff = require("../models/Staff");
const Room = require("../models/Room");
const Donor = require("../models/Donor");
const Event = require("../models/Event");
const LeaveRequest = require("../models/LeaveRequest");
const sendEmail = require("../utils/sendMail");
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
    const leaveRequest = await LeaveRequest.findById(req.params.id)
  .populate({
    path: "staffId",
    populate: {
      path: "userId",
      select: "name email",
    },
  });

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
      leavingCaretaker.shift,
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
    await sendEmail({
      email: leaveRequest.staffId.userId.email,
      subject: "Leave Request Approved",
      html: `
    <h2>Hello ${leaveRequest.staffId.name},</h2>

    <p>Your leave request has been <b style="color:green;">APPROVED</b>.</p>

    <p>Your leave has been approved by the administrator.</p>

    <p><b>From:</b> ${new Date(leaveRequest.fromDate).toLocaleDateString()}</p>
    <p><b>To:</b> ${new Date(leaveRequest.toDate).toLocaleDateString()}</p>

    <br>
    <p>Thank you,</p>
    <p>Kinetic Care Team</p>
  `,
    });

    res.status(200).json({
      message: "Leave approved and residents reassigned successfully",
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
const leaveRequest = await LeaveRequest.findById(req.params.id)
  .populate({
    path: "staffId",
    populate: {
      path: "userId",
      select: "name email",
    },
  });
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
    await sendEmail({
      email: leaveRequest.staffId.userId.email,
      subject: "Leave Request Rejected",
      html: `
    <h2>Hello ${leaveRequest.staffId.name},</h2>

    <p>Your leave request has been <b style="color:red;">REJECTED</b>.</p>

    <p>Unfortunately, your leave request could not be approved.</p>

    <p><b>From:</b> ${new Date(leaveRequest.fromDate).toLocaleDateString()}</p>
    <p><b>To:</b> ${new Date(leaveRequest.toDate).toLocaleDateString()}</p>

    <br>
    <p>Please contact the administrator for more information.</p>

    <p>Kinetic Care Team</p>
  `,
    });

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
