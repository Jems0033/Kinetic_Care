const mongoose = require("mongoose");


const visitorSchema = new mongoose.Schema({

    visitorName:String,

    residentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Resident"
    },

    date:Date,

    entryTime:String,

    exitTime:String

});


module.exports = mongoose.model("Visitor", visitorSchema);