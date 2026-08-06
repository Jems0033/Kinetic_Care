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
  enum: ["Day", "Night"],
  required: true,
},

    // =========================
// DAY SHIFT TASKS
// =========================

dayTasks: {
  medicine: {
    type: Boolean,
    default: false,
  },

  breakfast: {
    type: Boolean,
    default: false,
  },

  bath: {
    type: Boolean,
    default: false,
  },

  hygiene: {
    type: Boolean,
    default: false,
  },

  walk: {
    type: Boolean,
    default: false,
  },

  water: {
    type: Boolean,
    default: false,
  },

  healthCheck: {
    type: Boolean,
    default: false,
  },

  lunch: {
    type: Boolean,
    default: false,
  },
},

// =========================
// NIGHT SHIFT TASKS
// =========================

nightTasks: {
  medicine: {
    type: Boolean,
    default: false,
  },

  dinner: {
    type: Boolean,
    default: false,
  },

  water: {
    type: Boolean,
    default: false,
  },

  sleep: {
    type: Boolean,
    default: false,
  },

  healthCheck: {
    type: Boolean,
    default: false,
  },

  comfort: {
    type: Boolean,
    default: false,
  },

  sleeping: {
    type: Boolean,
    default: false,
  },
},

    // =========================
// DAY CUSTOM TASKS
// =========================

dayCustomTasks: [
  {
    key: String,
    title: String,
    description: {
      type: String,
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

// =========================
// NIGHT CUSTOM TASKS
// =========================

nightCustomTasks: [
  {
    key: String,
    title: String,
    description: {
      type: String,
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
