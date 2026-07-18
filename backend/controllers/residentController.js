const Resident = require("../models/Resident");

const Room=require("../models/Room");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const FamilyMember = require("../models/FamilyMember");

const addResident=async(req,res)=>{

    try{

        const room=await Room.findById(req.body.room);

        if(!room){

            return res.status(404).json({

                message:"Room Not Found"

            });

        }

        if(room.occupiedBeds>=room.capacity){

            return res.status(400).json({

                message:"Room Full"

            });

        }

        const resident = await Resident.create({
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender,
    room: req.body.room,
    medicalCondition: req.body.medicalCondition,
    status: req.body.status
});

if (
    req.body.familyName &&
    req.body.familyEmail &&
    req.body.familyPhone &&
    req.body.familyPassword &&
    req.body.relation
) {

    const userExists = await User.findOne({
        email: req.body.familyEmail
    });

    if (userExists) {
        return res.status(400).json({
            message: "Family Email Already Exists"
        });
    }

    const hashedPassword = await bcrypt.hash(
        req.body.familyPassword,
        10
    );

    const user = await User.create({

        name: req.body.familyName,

        email: req.body.familyEmail,

        phone: req.body.familyPhone,

        password: hashedPassword,

        role: "family"

    });

    await FamilyMember.create({

        userId: user._id,

        residentId: resident._id,

        relation: req.body.relation

    });

}

        room.occupiedBeds++;

        if(room.occupiedBeds===room.capacity){

            room.status="Occupied";

        }

        await room.save();

        res.status(201).json({

            message:"Resident Added Successfully",

            resident

        });

    }

    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};
// ===============================
// Get All Residents
// ===============================
const getResidents = async (req, res) => {
  try {

    const residents = await Resident.find()
      .populate("room", "roomNumber roomType");

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
      })
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
    const resident = await Resident.findById(req.params.id);

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

        if (oldRoom.occupiedBeds < oldRoom.capacity) {
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

      if (newRoom.occupiedBeds >= newRoom.capacity) {
        return res.status(400).json({
          message: "Room Full",
        });
      }

      newRoom.occupiedBeds++;

      if (newRoom.occupiedBeds === newRoom.capacity) {
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
    residentId: resident._id
});

if (family) {

    family.relation = req.body.relation;

    await family.save();

    await User.findByIdAndUpdate(

        family.userId,

        {

            name: req.body.familyName,

            email: req.body.familyEmail,

            phone: req.body.familyPhone

        }

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
    residentId: resident._id
});

if (family) {

    await User.findByIdAndDelete(
        family.userId
    );

    await FamilyMember.findByIdAndDelete(
        family._id
    );

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
            .sort({ createdAt: -1 })
            .limit(5);

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