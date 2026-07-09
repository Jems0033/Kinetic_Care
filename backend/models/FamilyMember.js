const mongoose = require("mongoose");

const familySchema = new mongoose.Schema({
    userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
},

    name:String,

    email:String,

    phone:String,

    relation:String,

    residentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Resident"
    }

});


module.exports = mongoose.model("FamilyMember", familySchema);