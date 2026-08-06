const MedicalRecord = require("../models/MedicalRecord");
const Staff = require("../models/Staff");
const Resident = require("../models/Resident");
const Room = require("../models/Room");

const getDoctorPatients = async (req, res) => {
  try {
    const staff = await Staff.findOne({
      userId: req.user.id,
    });

    if (!staff) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    const residents = await Resident.find({
      $or: [{ dayDoctor: staff._id }, { nightDoctor: staff._id }],
      status: {
        $ne: "Discharged",
      },
    }).populate("room");

    const patients = [];

    for (const resident of residents) {
      const latestRecord = await MedicalRecord.findOne({
        residentId: resident._id,
      }).sort({ date: -1 });

      patients.push({
        _id: resident._id,
        name: resident.name,
        age: resident.age,
        gender: resident.gender,
        room: resident.room ? resident.room.roomNumber : "-",
        latestProblem: latestRecord
          ? latestRecord.problem
          : "No medical problem",
        status: resident.status,
      });
    }

    res.json(patients);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getDoctorPatient = async (req, res) => {
  try {
    const staff = await Staff.findOne({
  userId: req.user.id,
});

if (!staff) {
  return res.status(404).json({
    message: "Doctor not found",
  });
}
    const resident = await Resident.findById(req.params.id);

    if (!resident) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    let roomNumber = "-";

    if (resident.room) {
      const room = await Room.findById(resident.room);

      if (room) {
        roomNumber = room.roomNumber;
      }
    }

    const records = await MedicalRecord.find({
      residentId: resident._id,
    }).sort({ date: -1 });

    res.json({
  resident: {
    _id: resident._id,
    name: resident.name,
    age: resident.age,
    gender: resident.gender,
    medicalCondition: resident.medicalCondition,
    room: roomNumber,
    status: resident.status,
  },

  doctor: {
    name: staff.name,
    shift: staff.shift,
  },

  records,
});
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
const addMedicalRecord = async (req, res) => {
  try {
    const staff = await Staff.findOne({
      userId: req.user.id,
    });

    if (!staff) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    const { residentId, problem, medicine } = req.body;
    const resident = await Resident.findById(residentId);

    if (resident.status === "Temporary Leave") {
      return res.status(400).json({
        message:
          "Resident is on Temporary Leave. Medical records cannot be added.",
      });
    }

    const record = await MedicalRecord.create({
      residentId,
      staffId: staff._id,
      doctor: staff.name,
      problem,
      medicine,
      date: new Date(),
    });

    res.status(201).json({
      message: "Medical Record Added",
      record,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getDoctorProfile = async (req, res) => {
  try {
    const staff = await Staff.findOne({
      userId: req.user.id,
    }).populate("userId");

    if (!staff) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.json({
      name: staff.name,
      email: staff.userId.email,
      phone: staff.phone,
      role: staff.role,
      shift: staff.shift,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateMedicalRecord = async (req, res) => {
  try {
    const staff = await Staff.findOne({
      userId: req.user.id,
    });

    if (!staff) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    const record = await MedicalRecord.findById(req.params.id);
    const resident = await Resident.findById(record.residentId);

    if (resident.status === "Temporary Leave") {
      return res.status(400).json({
        message:
          "Resident is on Temporary Leave. Medical records cannot be updated.",
      });
    }

    if (!record) {
      return res.status(404).json({
        message: "Medical Record not found",
      });
    }

    if (record.staffId.toString() !== staff._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to edit this record",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const recordDate = new Date(record.date);
    recordDate.setHours(0, 0, 0, 0);

    if (recordDate.getTime() !== today.getTime()) {
      return res.status(400).json({
        message: "Only today's medical record can be edited",
      });
    }

    record.problem = req.body.problem;
    record.medicine = req.body.medicine;

    await record.save();

    res.status(200).json({
      message: "Medical Record Updated Successfully",
      record,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDoctorPatients,
  getDoctorPatient,
  addMedicalRecord,
  getDoctorProfile,
  updateMedicalRecord,
};
