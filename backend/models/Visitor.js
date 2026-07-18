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
        default: Date.now,
    },

    status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
},

    checkIn: {
    type: Date,
    default: Date.now
},

checkOut: {
    type: Date
}

}, {
    timestamps: true
});

module.exports = mongoose.model("Visitor", visitorSchema);