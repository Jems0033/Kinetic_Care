const MedicalRecord = require("../models/MedicalRecord");
const Staff = require("../models/Staff");
const Resident = require("../models/Resident");
const Room = require("../models/Room");


const getDoctorDashboard = async (req, res) => {
  try {

    const staff = await Staff.findOne({ userId: req.user.id });

    if (!staff) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    const records = await MedicalRecord.find({
      staffId: staff._id,
    })
      .populate("residentId", "name age")
      .sort({ date: -1 });

    const patientIds = [
      ...new Set(records.map((r) => r.residentId._id.toString())),
    ];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayRecords = records.filter(
      (r) => new Date(r.date) >= today
    );

    res.json({
      totalPatients: patientIds.length,
      totalRecords: records.length,
      todayRecords: todayRecords.length,
      latestRecords: records.slice(0, 5),
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

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

    const records = await MedicalRecord.find({
      staffId: staff._id,
    })
      .populate("residentId")
      .sort({ date: -1 });

    const patients = [];
    const added = new Set();

    for (const record of records) {

      const resident = record.residentId;

      if (!resident) continue;

      if (!added.has(resident._id.toString())) {

        added.add(resident._id.toString());

        const room = await Room.findById(resident.room);

        patients.push({
          _id: resident._id,
          name: resident.name,
          age: resident.age,
          gender: resident.gender,
          room: room ? room.roomNumber : "-",
          latestProblem: record.problem,
        });

      }

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

    console.log("Patient ID:", req.params.id);

    const resident = await Resident.findById(req.params.id);

    console.log("Resident:", resident);

    if (!resident) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    let roomNumber = "-";

    if (resident.room) {
      const room = await Room.findById(resident.room);
      console.log("Room:", room);

      if (room) {
        roomNumber = room.roomNumber;
      }
    }

    const records = await MedicalRecord.find({
      residentId: resident._id,
    }).sort({ date: -1 });

    console.log("Records:", records);

    res.json({
      resident: {
        _id: resident._id,
        name: resident.name,
        age: resident.age,
        gender: resident.gender,
        medicalCondition: resident.medicalCondition,
        room: roomNumber,
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

module.exports = {
  getDoctorDashboard,
  getDoctorPatients,
  getDoctorPatient,
  addMedicalRecord,
};