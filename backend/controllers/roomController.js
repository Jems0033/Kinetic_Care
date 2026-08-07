const Room = require("../models/Room");
const Resident = require("../models/Resident");

// ======================
// Add Room
// ======================
const addRoom = async (req, res) => {
  try {
    const roomExists = await Room.findOne({
      roomNumber: req.body.roomNumber.toUpperCase(),
    });

    if (roomExists) {
      return res.status(400).json({
        message: "Room Number Already Exists",
      });
    }

    const room = await Room.create(req.body);

    res.status(201).json({
      message: "Room Added Successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================
// Get All Rooms
// ======================
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });

    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({
      message: error.message,
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
        message: "Room Not Found",
      });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================
// Update Room
// ======================
const updateRoom = async (req, res) => {
  try {
    const currentRoom = await Room.findById(req.params.id);

    if (!currentRoom) {
      return res.status(404).json({
        message: "Room Not Found",
      });
    }

    // ==============================
    // Check duplicate room number
    // ==============================
    if (req.body.roomNumber) {
      const roomExists = await Room.findOne({
        roomNumber: req.body.roomNumber.toUpperCase(),
        _id: { $ne: req.params.id },
      });

      if (roomExists) {
        return res.status(400).json({
          message: "Room Number Already Exists",
        });
      }
    }

    // ====================================================
    // IF ROOM IS CHANGED TO MAINTENANCE
    // ====================================================
    if (
      req.body.status === "Maintenance" &&
      currentRoom.status !== "Maintenance"
    ) {
      // Get all active residents currently in this room
      const residents = await Resident.find({
        room: currentRoom._id,
        status: "Active",
      });

      // If residents exist, find replacement rooms
      if (residents.length > 0) {
        const availableRooms = await Room.find({
          _id: { $ne: currentRoom._id },
          status: { $ne: "Maintenance" },
        }).sort({ occupiedBeds: 1 });

        // -----------------------------------------
        // First check WITHOUT changing database
        // -----------------------------------------

        const roomSlots = availableRooms.map((room) => ({
          roomId: room._id,
          roomNumber: room.roomNumber,
          capacity: Number(room.capacity || 0),
          occupiedBeds: Number(room.occupiedBeds || 0),
          freeBeds:
            Number(room.capacity || 0) -
            Number(room.occupiedBeds || 0),
        }));

        const assignments = [];

        for (const resident of residents) {
          const roomIndex = roomSlots.findIndex(
            (room) => room.freeBeds > 0
          );

          if (roomIndex === -1) {
            return res.status(400).json({
              message:
                "Cannot set room to Maintenance. Not enough rooms are available for residents.",
            });
          }

          assignments.push({
            residentId: resident._id,
            newRoomId: roomSlots[roomIndex].roomId,
          });

          // Reserve one bed temporarily
          roomSlots[roomIndex].freeBeds -= 1;
          roomSlots[roomIndex].occupiedBeds += 1;
        }

        // =========================================
        // All residents can be moved
        // Now actually update database
        // =========================================

        for (const assignment of assignments) {
          await Resident.findByIdAndUpdate(
            assignment.residentId,
            {
              room: assignment.newRoomId,
            }
          );

          await Room.findByIdAndUpdate(
            assignment.newRoomId,
            {
              $inc: { occupiedBeds: 1 },
            }
          );
        }

        // Current maintenance room becomes empty
        currentRoom.occupiedBeds = 0;
        await currentRoom.save();
      }
    }

    // ==============================
    // Update Room
    // ==============================
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Room Updated Successfully",
      room,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
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
        message: "Room Not Found",
      });
    }

    res.status(200).json({
      message: "Room Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAvailableRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      status: "Available",
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
