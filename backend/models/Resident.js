const mongoose = require("mongoose");

const residentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    medicalCondition: {
      type: String,
    },

    admissionDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["Active", "Discharged", "Temporary Leave"],
      default: "Active",
    },

    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },

    dayDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },

    dayCaretaker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },

    nightDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },

    nightCaretaker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Resident", residentSchema);
