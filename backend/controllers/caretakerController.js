const Staff = require("../models/Staff");
const Resident = require("../models/Resident");
const CareRecord = require("../models/CareRecord");

// ====================================
// Caretaker Dashboard
// ====================================

const getCaretakerDashboard = async (req, res) => {
  try {
    const caretaker = await Staff.findOne({
      userId: req.user.id,
      role: "Caretaker",
    });

    if (!caretaker) {
      return res.status(404).json({
        message: "Caretaker not found",
      });
    }

    let residents = [];

    if (caretaker.shift === "Day") {
      residents = await Resident.find({
        dayCaretaker: caretaker._id,
        status: "Active",
      })
        .populate("room", "roomNumber roomType")
        .populate("dayDoctor", "name phone")
        .select(
          "name age gender medicalCondition room dayDoctor dayCaretaker",
        );
    } else if (caretaker.shift === "Night") {
      residents = await Resident.find({
        nightCaretaker: caretaker._id,
        status: "Active",
      })
        .populate("room", "roomNumber roomType")
        .populate("nightDoctor", "name phone")
        .select(
          "name age gender medicalCondition room nightDoctor nightCaretaker",
        );
    }

    res.status(200).json({
      caretaker: {
        id: caretaker._id,
        name: caretaker.name,
        phone: caretaker.phone,
        shift: caretaker.shift,
        role: caretaker.role,
      },

      totalResidents: residents.length,

      residents: residents,
    });
  } catch (error) {
    console.log("Caretaker Dashboard Error:", error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ==========================================
// Get Single Resident
// ==========================================

const getResidentCare = async (req, res) => {
  try {
    const caretaker = await Staff.findOne({
      userId: req.user.id,
      role: "Caretaker",
    });

    if (!caretaker) {
      return res.status(404).json({
        message: "Caretaker not found",
      });
    }

    const resident = await Resident.findById(req.params.id)
      .populate("room", "roomNumber roomType")
      .populate("dayDoctor", "name phone")
      .populate("nightDoctor", "name phone");

    if (!resident) {
      return res.status(404).json({
        message: "Resident not found",
      });
    }

    // Check whether this resident belongs to logged-in caretaker
    let assigned = false;

    if (
      caretaker.shift === "Day" &&
      resident.dayCaretaker?.toString() === caretaker._id.toString()
    ) {
      assigned = true;
    }

    if (
      caretaker.shift === "Night" &&
      resident.nightCaretaker?.toString() === caretaker._id.toString()
    ) {
      assigned = true;
    }

    if (!assigned) {
      return res.status(403).json({
        message: "This resident is not assigned to you",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayCare = await CareRecord.findOne({
      residentId: resident._id,
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    res.status(200).json({
      resident,
      caretaker: {
        name: caretaker.name,
        shift: caretaker.shift,
      },
      todayCare: todayCare || {
        dayTasks: {},
        nightTasks: {},
        dayCustomTasks: [],
        nightCustomTasks: [],
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ==========================================
// Save / Update Daily Care
// ==========================================

const saveDailyCare = async (req, res) => {
  try {
    const caretaker = await Staff.findOne({
      userId: req.user.id,
      role: "Caretaker",
    });

    if (!caretaker) {
      return res.status(404).json({
        message: "Caretaker not found",
      });
    }

    const resident = await Resident.findById(req.params.id);

    if (!resident) {
      return res.status(404).json({
        message: "Resident not found",
      });
    }

    let assigned = false;

    if (
      caretaker.shift === "Day" &&
      resident.dayCaretaker?.toString() === caretaker._id.toString()
    ) {
      assigned = true;
    }

    if (
      caretaker.shift === "Night" &&
      resident.nightCaretaker?.toString() === caretaker._id.toString()
    ) {
      assigned = true;
    }

    if (!assigned) {
      return res.status(403).json({
        message: "Resident is not assigned to you",
      });
    }

    const { dayTasks, nightTasks, dayCustomTasks, nightCustomTasks, notes } =
      req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let careRecord = await CareRecord.findOne({
      residentId: resident._id,
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    if (careRecord) {
      if (caretaker.shift === "Day") {
        careRecord.dayTasks = dayTasks;
        careRecord.dayCustomTasks = dayCustomTasks || [];
      } else {
        careRecord.nightTasks = nightTasks;
        careRecord.nightCustomTasks = nightCustomTasks || [];
      }

      careRecord.notes = notes;
careRecord.caretakerId = caretaker._id;
careRecord.shift = caretaker.shift;

await careRecord.save();

      await careRecord.save();
    } else {
      careRecord = await CareRecord.create({
        residentId: resident._id,
        caretakerId: caretaker._id,
        shift: caretaker.shift,

        dayTasks: caretaker.shift === "Day" ? dayTasks : {},

        nightTasks: caretaker.shift === "Night" ? nightTasks : {},

        dayCustomTasks: caretaker.shift === "Day" ? dayCustomTasks || [] : [],

        nightCustomTasks:
          caretaker.shift === "Night" ? nightCustomTasks || [] : [],

        notes,
      });
    }

    res.status(200).json({
      message: "Daily care saved successfully",
      careRecord,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ==========================================
// Caretaker Profile
// ==========================================

const getCaretakerProfile = async (req, res) => {
  try {
    const caretaker = await Staff.findOne({
      userId: req.user.id,
      role: "Caretaker",
    }).populate("userId", "email");

    if (!caretaker) {
      return res.status(404).json({
        message: "Caretaker not found",
      });
    }

    res.status(200).json({
      id: caretaker._id,
      name: caretaker.name,
      email: caretaker.userId?.email || "",
      phone: caretaker.phone,
      gender: caretaker.gender,
      role: caretaker.role,
      shift: caretaker.shift,
      salary: caretaker.salary,
    });
  } catch (error) {
    console.log("Caretaker Profile Error:", error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getCaretakerDashboard,
  getResidentCare,
  saveDailyCare,
  getCaretakerProfile,
};
