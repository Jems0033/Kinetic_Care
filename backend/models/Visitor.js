const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({

    residentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resident",
        required: true
    },

    visitorName: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    relation: {
        type: String,
        required: true
    },

    purpose: {
        type: String,
        required: true
    },

    visitDate: {
        type: Date,
        required: true
    },

    checkIn: {
        type: Date
    },

    checkOut: {
        type: Date
    },

    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Visitor", visitorSchema);