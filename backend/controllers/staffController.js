const Room = require("../models/Room");
const Staff = require("../models/Staff");
const User = require("../models/User");
const Resident = require("../models/Resident");
const MedicineLog = require("../models/MedicineLog");
const Vital = require("../models/Vital");
const bcrypt = require("bcrypt");
// Add Staff
const addStaff = async (req, res) => {
  let createdUser = null;

  try {
    const {
      name,
      email,
      password,
      phone,
      role,
      shift,
      salary,
      address,
    } = req.body;

    if (!name || !email || !password || !role || !shift) {
      return res.status(400).json({
        message: "Name, email, password, role and shift are required",
      });
    }

    const validRoles = [
      "Doctor",
      "Nurse",
      "Caretaker",
      "Manager",
      "Receptionist",
    ];

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid staff role",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const loginRole = role === "Doctor" ? "doctor" : "staff";

    createdUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      role: loginRole,
    });

    const staff = await Staff.create({
      name,
      email: email.toLowerCase(),
      phone,
      role,
      shift,
      salary,
      address,
      userId: createdUser._id,
    });

    return res.status(201).json({
      message: "Staff and login account created successfully",
      staff,
    });
  } catch (error) {
    if (createdUser) {
      await User.findByIdAndDelete(createdUser._id);
    }

    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Staff
const getStaff = async (req, res) => {

    try {

        const staff = await Staff.find();

        res.status(200).json(staff);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

};

// Get Staff By Id
const getStaffById = async (req, res) => {

    try {

        const staff = await Staff.findById(req.params.id);

        if (!staff) {

            return res.status(404).json({
                message: "Staff Not Found",
            });

        }

        res.status(200).json(staff);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

};

// Update Staff
const updateStaff = async (req, res) => {

    try {

        const staff = await Staff.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json({
            message: "Staff Updated Successfully",
            staff,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

};

// Delete Staff
const deleteStaff = async (req, res) => {

    try {

        const staff = await Staff.findById(req.params.id);

        if (!staff) {
            return res.status(404).json({
                message: "Staff Not Found"
            });
        }

        // Delete User
        await User.findByIdAndDelete(staff.userId);

        // Delete Staff
        await Staff.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Staff Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

    // ==========================
// Get All Doctors
// ==========================
const getDoctors = async (req, res) => {

    try {

        const doctors = await Staff.find({
            role: "Doctor"
        });

        res.status(200).json(doctors);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const getStaffDashboard = async (req, res) => {
  try {

    const staff = await Staff.findOne({
      userId: req.user.id,
    });

    if (!staff) {
      return res.status(404).json({
        message: "Staff not found",
      });
    }

    const totalResidents = await Resident.countDocuments();

    res.json({
      name: staff.name,
      role: staff.role,
      shift: staff.shift,
      totalResidents,
      assignedResidents: totalResidents
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const getStaffResidents = async (req, res) => {
  try {

    const residents = await Resident.find()
      .populate("room", "roomNumber")
      .sort({ createdAt: -1 });

    const data = residents.map((resident) => ({
      _id: resident._id,
      name: resident.name,
      age: resident.age,
      gender: resident.gender,
      room: resident.room ? resident.room.roomNumber : "N/A",
      medicalCondition: resident.medicalCondition,
    }));

    res.json(data);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

const getStaffResidentById = async (req, res) => {
  try {
    const resident = await Resident.findById(req.params.id)
      .populate("room", "roomNumber roomType");

    if (!resident) {
      return res.status(404).json({
        message: "Resident not found",
      });
    }

    return res.status(200).json({
      resident,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const updateVitals = async (req, res) => {
  try {
    const {
      temperature,
      bloodPressure,
      pulse,
      sugarLevel,
      weight,
      notes,
    } = req.body;

    const vital = await Vital.create({
      resident: req.params.id,
      staff: req.user.id,
      temperature,
      bloodPressure,
      pulse,
      sugarLevel,
      weight,
      notes,
    });

    res.status(201).json({
      message: "Vitals Updated Successfully",
      vital,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const giveMedicine = async (req, res) => {
  try {
    const {
      medicineName,
      dosage,
      time,
      status,
      notes,
    } = req.body;

    const medicine = await MedicineLog.create({
      resident: req.params.id,
      staff: req.user.id,
      medicineName,
      dosage,
      time,
      status,
      notes,
    });

    res.status(201).json({
      message: "Medicine record saved successfully.",
      medicine,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



const getResidentHistory = async (req, res) => {
  try {
    const vitals = await Vital.find({
      resident: req.params.id,
    })
      .populate("staff", "name")
      .sort({ createdAt: -1 });

    const medicines = await MedicineLog.find({
      resident: req.params.id,
    })
      .populate("staff", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      vitals,
      medicines,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
    addStaff,
    getStaff,
    getStaffById,
    updateStaff,
    deleteStaff,
    getDoctors,
    getStaffDashboard,
    getStaffResidents,
    getStaffResidentById,
    updateVitals,
    giveMedicine,
    getResidentHistory,
};