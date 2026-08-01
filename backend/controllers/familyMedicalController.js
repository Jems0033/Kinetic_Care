const FamilyMember = require("../models/FamilyMember");
const MedicalRecord = require("../models/MedicalRecord");

const getMedicalHistory = async (req, res) => {
  try {
    const residentId = req.params.residentId;

    // Check કે આ resident logged-in family સાથે linked છે કે નહીં
    const family = await FamilyMember.findOne({
      userId: req.user.id,
      residentId: residentId,
    });

    if (!family) {
      return res.status(403).json({
        message: "Unauthorized Access",
      });
    }

    const records = await MedicalRecord.find({
      residentId: residentId,
    })
      .populate("staffId", "name")
      .sort({ date: -1 });

    res.status(200).json(records);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getMedicalHistory,
};