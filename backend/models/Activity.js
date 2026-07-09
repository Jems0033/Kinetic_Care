const mongoose = require("mongoose");


const activitySchema = new mongoose.Schema({

    name:String,

    description:String,

    date:Date,

    participants:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Resident"
        }
    ]

});


module.exports = mongoose.model("Activity", activitySchema);