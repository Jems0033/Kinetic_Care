const mongoose = require("mongoose");

const careRecordSchema = new mongoose.Schema(
  {
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
    },

    caretakerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },

    shift: {
      type: String,
      enum: ["Morning", "Night"],
      required: true,
    },

    medicine: {
      type: Boolean,
      default: false,
    },

    meal: {
      type: Boolean,
      default: false,
    },

    bath: {
      type: Boolean,
      default: false,
    },

    walking: {
      type: Boolean,
      default: false,
    },

    water: {
      type: Boolean,
      default: false,
    },

    rest: {
      type: Boolean,
      default: false,
    },

    // =========================
    // CUSTOM TASKS
    // =========================
    customTasks: [
      {
        key: {
          type: String,
          required: true,
        },

        title: {
          type: String,
          required: true,
          trim: true,
        },

        description: {
          type: String,
          trim: true,
          default: "",
        },

        icon: {
          type: String,
          default: "📋",
        },

        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],

    notes: {
      type: String,
      trim: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("CareRecord", careRecordSchema);
