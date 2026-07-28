const mongoose = require("mongoose");


const staffSchema = new mongoose.Schema({
    userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
},
    name:String,

    role:{
        type:String,
        enum:[
            "Doctor",
            "Caretaker",
        ],
        required:true
    },

    phone:String,

    shift:{
    type:String,
    enum:[
        "Morning",
        "Night"
    ]
},

    salary:Number

});


module.exports = mongoose.model("Staff", staffSchema);