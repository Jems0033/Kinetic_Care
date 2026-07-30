const Resident = require("../models/Resident");

const Room = require("../models/Room");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Staff = require("../models/Staff");
const FamilyMember = require("../models/FamilyMember");

const getLeastAssignedStaff = async (role, shift, residentField) => {
  const staff = await Staff.aggregate([
    {
      $match: {
        role: role,
        shift: shift,
      },
    },
    {
      $lookup: {
        from: "residents",
        localField: "_id",
        foreignField: residentField,
        as: "assignedResidents",
      },
    },
    {
      $addFields: {
        totalAssigned: {
          $size: "$assignedResidents",
        },
      },
    },
    {
      $sort: {
        totalAssigned: 1,
      },
    },
    {
      $limit: 1,
    },
  ]);

  return staff[0];
};

const addResident = async (req, res) => {
  let resident = null;
  let firstResident = null;
  let secondResident = null;

  try {
    const { isFamily } = req.body;

    const roomId = isFamily ? req.body.resident1.room : req.body.room;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room Not Found",
      });
    }

    if (isFamily && room.roomType !== "Double") {
      return res.status(400).json({
        message: "Family residents can only stay in Double Bed rooms.",
      });
    }

    let totalCapacity = room.capacity;

    if (room.roomType === "Double") {
      totalCapacity = room.capacity * 2;
    }

    if (room.occupiedBeds >= totalCapacity) {
      return res.status(400).json({
        message: "Room Full",
      });
    }

    // ===========================
    // STAFF ASSIGNMENT
    // ===========================

    const morningDoctor = await getLeastAssignedStaff(
      "Doctor",
      "Morning",
      "morningDoctor"
    );

    const nightDoctor = await getLeastAssignedStaff(
      "Doctor",
      "Night",
      "nightDoctor"
    );

    const morningCaretaker = await getLeastAssignedStaff(
      "Caretaker",
      "Morning",
      "morningCaretaker"
    );

    const nightCaretaker = await getLeastAssignedStaff(
      "Caretaker",
      "Night",
      "nightCaretaker"
    );

    if (
      !morningDoctor ||
      !nightDoctor ||
      !morningCaretaker ||
      !nightCaretaker
    ) {
      return res.status(400).json({
        message:
          "Morning/Night doctor ane caretaker available nathi. Pela staff add karo.",
      });
    }

    // ===========================
    // FAMILY DETAILS
    // ===========================

    const familyData = isFamily ? req.body.resident1 : req.body;

    const hasFamily =
      familyData.familyName &&
      familyData.familyEmail &&
      familyData.familyPhone &&
      familyData.familyPassword &&
      familyData.relation;

    if (hasFamily) {
      const existingUser = await User.findOne({
        email: familyData.familyEmail,
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Family Email Already Exists",
        });
      }
    }

    // ===========================
    // FAMILY RESIDENTS
    // ===========================

    if (isFamily) {
      const { resident1, resident2 } = req.body;

      firstResident = await Resident.create({
        name: resident1.name,
        age: resident1.age,
        gender: resident1.gender,
        room: resident1.room,
        medicalCondition: resident1.medicalCondition,
        status: "Active",

        morningDoctor: morningDoctor._id,
        morningCaretaker: morningCaretaker._id,
        nightDoctor: nightDoctor._id,
        nightCaretaker: nightCaretaker._id,
      });

      secondResident = await Resident.create({
        name: resident2.name,
        age: resident2.age,
        gender: resident2.gender,
        room: resident1.room,
        medicalCondition: resident2.medicalCondition,
        status: "Active",

        morningDoctor: morningDoctor._id,
        morningCaretaker: morningCaretaker._id,
        nightDoctor: nightDoctor._id,
        nightCaretaker: nightCaretaker._id,
      });

      if (hasFamily) {
        const hashedPassword = await bcrypt.hash(
          resident1.familyPassword,
          10
        );

        const user = await User.create({
          name: resident1.familyName,
          email: resident1.familyEmail,
          phone: resident1.familyPhone,
          password: hashedPassword,
          role: "family",
        });

        await FamilyMember.create({
          userId: user._id,
          residentId: firstResident._id,
          relation: resident1.relation,
        });

        await FamilyMember.create({
          userId: user._id,
          residentId: secondResident._id,
          relation: resident1.relation,
        });
      }

      room.occupiedBeds += 2;
    }

    // ===========================
    // SINGLE RESIDENT
    // ===========================

    else {
      resident = await Resident.create({
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        room: req.body.room,
        medicalCondition: req.body.medicalCondition,
        status: req.body.status || "Active",

        morningDoctor: morningDoctor._id,
        morningCaretaker: morningCaretaker._id,
        nightDoctor: nightDoctor._id,
        nightCaretaker: nightCaretaker._id,
      });

      if (hasFamily) {
        const hashedPassword = await bcrypt.hash(
          familyData.familyPassword,
          10
        );

        const user = await User.create({
          name: familyData.familyName,
          email: familyData.familyEmail,
          phone: familyData.familyPhone,
          password: hashedPassword,
          role: "family",
        });

        await FamilyMember.create({
          userId: user._id,
          residentId: resident._id,
          relation: familyData.relation,
        });
      }

      room.occupiedBeds++;
    }

    if (room.occupiedBeds >= totalCapacity) {
      room.status = "Occupied";
    }

    await room.save();

    if (isFamily) {
      return res.status(201).json({
        message: "Family Residents Added Successfully",
        residents: [firstResident, secondResident],
      });
    }

    return res.status(201).json({
      message: "Resident Added Successfully",
      resident,
    });
  } catch (error) {
    if (resident) {
      await Resident.findByIdAndDelete(resident._id);
    }

    if (firstResident) {
      await Resident.findByIdAndDelete(firstResident._id);
    }

    if (secondResident) {
      await Resident.findByIdAndDelete(secondResident._id);
    }

    res.status(500).json({
      message: error.message,
    });
  }
};
// ===============================
// Get All Residents
// ===============================
const getResidents = async (req, res) => {
  try {
    const residents = await Resident.find()
      .populate("room", "roomNumber roomType")
      .populate("morningDoctor", "name phone shift")
      .populate("morningCaretaker", "name phone shift")
      .populate("nightDoctor", "name phone shift")
      .populate("nightCaretaker", "name phone shift");

    const data = await Promise.all(
      residents.map(async (resident) => {
        const family = await FamilyMember.findOne({
          residentId: resident._id,
        }).populate("userId", "name email phone");

        return {
          ...resident.toObject(),
          family: family
            ? {
                name: family.userId.name,
                email: family.userId.email,
                phone: family.userId.phone,
                relation: family.relation,
              }
            : null,
        };
      }),
    );

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Get Resident By ID
// ===============================
const getResidentById = async (req, res) => {
  try {
    const resident = await Resident.findById(req.params.id)
      .populate("room", "roomNumber roomType")
      .populate("morningDoctor", "name phone")
      .populate("morningCaretaker", "name phone")
      .populate("nightDoctor", "name phone")
      .populate("nightCaretaker", "name phone");
    if (!resident) {
      return res.status(404).json({
        message: "Resident Not Found",
      });
    }

    res.status(200).json(resident);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Update Resident
// ===============================
const updateResident = async (req, res) => {
  try {
    const resident = await Resident.findById(req.params.id);

    if (!resident) {
      return res.status(404).json({
        message: "Resident Not Found",
      });
    }

    // Room change thayo?
    if (resident.room.toString() !== req.body.room) {
      // Old Room
      const oldRoom = await Room.findById(resident.room);

      if (oldRoom) {
        oldRoom.occupiedBeds--;

        if (oldRoom.occupiedBeds < 0) {
          oldRoom.occupiedBeds = 0;
        }

        let oldCapacity = oldRoom.capacity;

        if (oldRoom.roomType === "Double") {
          oldCapacity = oldRoom.capacity * 2;
        }

        if (oldRoom.occupiedBeds < oldCapacity) {
          oldRoom.status = "Available";
        }

        await oldRoom.save();
      }

      // New Room
      const newRoom = await Room.findById(req.body.room);

      if (!newRoom) {
        return res.status(404).json({
          message: "New Room Not Found",
        });
      }

      let newCapacity = newRoom.capacity;

      if (newRoom.roomType === "Double") {
        newCapacity = newRoom.capacity * 2;
      }

      if (newRoom.occupiedBeds >= newCapacity) {
        return res.status(400).json({
          message: "Room Full",
        });
      }

      newRoom.occupiedBeds++;

      if (newRoom.occupiedBeds === newCapacity) {
        newRoom.status = "Occupied";
      }

      await newRoom.save();
    }

    resident.name = req.body.name;
    resident.age = req.body.age;
    resident.gender = req.body.gender;
    resident.room = req.body.room;
    resident.medicalCondition = req.body.medicalCondition;
    resident.status = req.body.status;

    await resident.save();

    const family = await FamilyMember.findOne({
      residentId: resident._id,
    });

    if (family) {
      family.relation = req.body.relation;

      await family.save();

      await User.findByIdAndUpdate(
        family.userId,

        {
          name: req.body.familyName,

          email: req.body.familyEmail,

          phone: req.body.familyPhone,
        },
      );
    }

    res.status(200).json({
      message: "Resident Updated Successfully",
      resident,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Delete Resident
// ===============================
const deleteResident = async (req, res) => {
  try {
    const resident = await Resident.findById(req.params.id);

    if (!resident) {
      return res.status(404).json({
        message: "Resident Not Found",
      });
    }

    // Room Update
    const room = await Room.findById(resident.room);

    if (room) {
      room.occupiedBeds--;

      if (room.occupiedBeds < 0) {
        room.occupiedBeds = 0;
      }

      room.status = "Available";

      await room.save();
    }

    const family = await FamilyMember.findOne({
  residentId: resident._id,
});

if (family) {

  const totalLinks = await FamilyMember.countDocuments({
    userId: family.userId,
  });

  await FamilyMember.findByIdAndDelete(family._id);

  if (totalLinks === 1) {
    await User.findByIdAndDelete(family.userId);
  }

}
    // Delete Resident
    await Resident.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Resident Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getRecentResidents = async (req, res) => {
  try {
    const residents = await Resident.find()
      .populate("room")
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json(residents);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addResident,
  getResidents,
  getResidentById,
  updateResident,
  deleteResident,
  getRecentResidents,
};
