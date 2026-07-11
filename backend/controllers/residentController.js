const Resident = require("../models/Resident");

const Room=require("../models/Room");

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

        const resident=await Resident.create(req.body);

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
    const residents = await Resident.find().populate("room", "roomNumber roomType");

    res.status(200).json(residents);
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