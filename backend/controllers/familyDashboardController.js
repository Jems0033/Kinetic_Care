const FamilyMember = require("../models/FamilyMember");
const Resident = require("../models/Resident");
const MedicalRecord = require("../models/MedicalRecord");
const Event = require("../models/Event");


const getFamilyDashboard = async (req, res) => {
  try {
    // Family ના બધા residents
    const familyMembers = await FamilyMember.find({
      userId: req.user.id,
    });

    if (!familyMembers.length) {
      return res.status(404).json({
        message: "Family member not found",
      });
    }

    const residentIds = familyMembers.map(
      (member) => member.residentId
    );

    // Residents
    const residents = await Resident.find({
      _id: { $in: residentIds },
    }).populate("room");

    // દરેક resident સાથે latest medical ઉમેરો
    const residentData = await Promise.all(
      residents.map(async (resident) => {
        const latestMedical = await MedicalRecord.findOne({
          residentId: resident._id,
        })
          .populate("staffId")
          .sort({ date: -1 });

        return {
          _id: resident._id,
          name: resident.name,
          age: resident.age,
          gender: resident.gender,
          room: resident.room
            ? resident.room.roomNumber
            : "-",
          latestMedical,
        };
      })
    );

    // કુલ Medical Records
    const medicalCount = await MedicalRecord.countDocuments({
      residentId: { $in: residentIds },
    });

    // Upcoming Events
    const eventCount = await Event.countDocuments({
      eventDate: { $gte: new Date() },
    });

    res.status(200).json({
      residents: residentData,
      medicalCount,
      eventCount,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};


const getProfile = async (req, res) => {
  try {
    const family = await FamilyMember.findOne({
      userId: req.user.id,
    }).populate("userId");

    if (!family) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.json({
  _id: family._id,
  name: family.userId.name,
  email: family.userId.email,
  phone: family.userId.phone,
  relation: family.relation,
  address: family.address,
});
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getFamilyDashboard,
  getProfile,
};