const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    phone:{
        type:String,
        required: true
    },

    email:{
        type:String,
        required: true
    },

    amount:{
        type:Number,
        required:true
    },

    donationType:{
        type:String,
        enum:["Money","Food","Medicine","Clothes","Other"],
        required:true
    },

    donationDate:{
        type:Date,
        default:Date.now
    },

    address:String

},{
    timestamps:true
});

module.exports=mongoose.model("Donor",donorSchema);