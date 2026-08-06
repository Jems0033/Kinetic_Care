const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema(
  {
    caretakerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },

    fromDate: {
      type: Date,
      required: true,
    },

    toDate: {
      type: Date,
      required: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    replacementCaretakers: [
      {
        oldCaretakerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Staff",
        },

        newCaretakerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Staff",
        },

        residentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Resident",
        },
      },
    ],

    reassignmentCompleted: {
      type: Boolean,
      default: false,
    },

    restorationCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("LeaveRequest", leaveRequestSchema);