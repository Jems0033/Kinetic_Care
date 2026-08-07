const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema(
  {
    staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
    required: true,
},

staffRole:{
    type:String,
    enum:["Caretaker","Doctor"],
    required:true,
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

    replacements: [
{
    residentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Resident"
    },

    oldStaffId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Staff"
    },

    newStaffId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Staff"
    }
}
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