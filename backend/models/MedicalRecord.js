const mongoose = require("mongoose");


const medicalSchema = new mongoose.Schema({

    residentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Resident",
        required: true

    },
    staffId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Staff",
    required: true

},

    doctor:String,

    problem:String,

    medicine:String,

    date:{
        type:Date,
        default:Date.now
    }

});


module.exports = mongoose.model("MedicalRecord", medicalSchema);