const mongoose = require("mongoose");


const staffSchema = new mongoose.Schema({
    userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
},
    name:String,

    role:{
        type:String,
        enum:[
            "Doctor",
            "Nurse",
            "Caretaker",
            "Manager",
            "Receptionist"
        ]
    },

    phone:String,

    shift:String,

    salary:Number

});


module.exports = mongoose.model("Staff", staffSchema);