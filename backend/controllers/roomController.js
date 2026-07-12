const Room = require("../models/Room");

// ======================
// Add Room
// ======================
const addRoom = async (req, res) => {

    try {

        const room = await Room.create(req.body);

        res.status(201).json({
            message: "Room Added Successfully",
            room
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ======================
// Get All Rooms
// ======================
const getRooms = async (req, res) => {

    try {

        const rooms = await Room.find();

        res.status(200).json(rooms);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ======================
// Get Room By Id
// ======================
const getRoomById = async (req, res) => {

    try {

        const room = await Room.findById(req.params.id);

        if (!room) {

            return res.status(404).json({
                message: "Room Not Found"
            });

        }

        res.status(200).json(room);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ======================
// Update Room
// ======================
const updateRoom = async (req, res) => {

    try {

        const room = await Room.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!room) {

            return res.status(404).json({
                message: "Room Not Found"
            });

        }

        res.status(200).json({
            message: "Room Updated Successfully",
            room
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ======================
// Delete Room
// ======================
const deleteRoom = async (req, res) => {

    try {

        const room = await Room.findByIdAndDelete(req.params.id);

        if (!room) {

            return res.status(404).json({
                message: "Room Not Found"
            });

        }

        res.status(200).json({
            message: "Room Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const getAvailableRooms = async (req, res) => {
  try {

    const rooms = await Room.find({
      status: "Available"
    });

    res.status(200).json(rooms);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

module.exports = {
    addRoom,
    getRooms,
    getRoomById,
    updateRoom,
    deleteRoom,
    getAvailableRooms,
};