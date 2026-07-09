const mongoose = require("mongoose");

const residentSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    age:{
        type:Number
    },

    gender:{
        type:String
    },

    phone:{
        type:String
    },

    address:{
        type:String
    },

    roomId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Room"
    },

    joiningDate:{
        type:Date,
        default:Date.now
    },

    healthStatus:{
        type:String
    }

});


module.exports = mongoose.model("Resident", residentSchema);