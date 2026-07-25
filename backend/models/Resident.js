const mongoose = require("mongoose");

const residentSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true,
        trim:true
    },

    age:{
        type:Number,
        required:true
    },

    gender:{
        type:String,
        enum:["Male","Female","Other"],
        required:true
    },

    // dob:{
    //     type:Date
    // },

    // bloodGroup:{
    //     type:String
    // },

    medicalCondition:{
        type:String
    },

    // emergencyContact:{
    //     type:String
    // },

    admissionDate:{
        type:Date,
        default:Date.now
    },

    status:{
        type:String,
        enum:["Active","Discharged"],
        default:"Active"
    },

    room:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room"
    },


},
{
    timestamps:true
}
);

module.exports = mongoose.model("Resident",residentSchema);