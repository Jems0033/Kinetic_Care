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
        ],
        required:true
    },

    phone:String,

    shift:{
    type:String,
    enum:[
        "Morning",
        "Evening",
        "Night"
    ]
},

    salary:Number

});


module.exports = mongoose.model("Staff", staffSchema);