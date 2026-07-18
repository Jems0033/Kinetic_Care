const FamilyMember = require("../models/FamilyMember");
const Resident = require("../models/Resident");
const MedicalRecord = require("../models/MedicalRecord");
const Event = require("../models/Event");

const getFamilyDashboard = async (req, res) => {
  try {
    // Login family member
    const family = await FamilyMember.findOne({
      userId: req.user.id,
    });

    if (!family) {
      return res.status(404).json({
        message: "Family member not found",
      });
    }

    // Resident details
    const resident = await Resident.findById(family.residentId).populate("room");

    if (!resident) {
      return res.status(404).json({
        message: "Resident not found",
      });
    }

    // Medical Records
    const medicalCount = await MedicalRecord.countDocuments({
      residentId: resident._id,
    });

    const latestMedical = await MedicalRecord.findOne({
  residentId: resident._id,
})
.populate("staffId")
.sort({ date: -1 });
    // Upcoming Events
    const eventCount = await Event.countDocuments({
      eventDate: { $gte: new Date() },
    });

    res.json({
      resident: {
        name: resident.name,
        age: resident.age,
        gender: resident.gender,
        room: resident.room ? resident.room.roomNumber : "-",
      },
      medicalCount,
      eventCount,
      latestMedical,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getFamilyDashboard,
};