const mongoose = require("mongoose");


const roomSchema = new mongoose.Schema({

    roomNumber:String,

    type:{
        type:String,
        enum:[
            "Single",
            "Double"
        ]
    },

    capacity:Number,

    occupied:{
        type:Boolean,
        default:false
    }

});


module.exports = mongoose.model("Room", roomSchema);