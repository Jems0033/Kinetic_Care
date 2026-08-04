const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: String,

    role: {
      type: String,
      enum: ["Doctor", "Caretaker"],
      required: true,
    },

    phone: String,
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },

    shift: {
      type: String,
      enum: ["Morning", "Night"],
    },

    salary: Number,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Staff", staffSchema);
