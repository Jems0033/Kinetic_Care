const FamilyMember = require("../models/FamilyMember");
const MedicalRecord = require("../models/MedicalRecord");

const getMedicalHistory = async (req, res) => {
  try {
    const family = await FamilyMember.findOne({
      userId: req.user.id,
    });

    if (!family) {
      return res.status(404).json({
        message: "Family member not found",
      });
    }

    const records = await MedicalRecord.find({
      residentId: family.residentId,
    })
      .populate("staffId", "name")
      .sort({ date: -1 });

    res.json(records);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getMedicalHistory,
};