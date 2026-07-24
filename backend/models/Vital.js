const mongoose = require("mongoose");

const vitalSchema = new mongoose.Schema(
  {
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
    },

    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    temperature: {
      type: Number,
      required: true,
    },

    bloodPressure: {
      type: String,
      required: true,
    },

    pulse: {
      type: Number,
      required: true,
    },

    sugarLevel: {
      type: Number,
    },

    weight: {
      type: Number,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Vital", vitalSchema);