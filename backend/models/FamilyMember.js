const mongoose = require("mongoose");
const familySchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    residentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Resident",
        required:true
    },

    relation:{
        type:String,
        required:true
    }

},{
    timestamps:true
});
module.exports = mongoose.model("FamilyMember", familySchema);