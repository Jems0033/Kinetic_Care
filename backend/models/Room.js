const mongoose = require("mongoose");
const roomSchema = new mongoose.Schema({

    roomNumber: {
        type: String,
        required: true,
        unique: true
    },

    roomType: {
        type: String,
        enum: ["Single", "Double", "Deluxe"],
        required: true
    },

    capacity: {
        type: Number,
        required: true
    },

    occupiedBeds: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: ["Available", "Occupied", "Maintenance"],
        default: "Available"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Room", roomSchema);