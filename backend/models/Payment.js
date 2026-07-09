const mongoose = require("mongoose");


const paymentSchema = new mongoose.Schema({

    residentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Resident"
    },

    amount:Number,

    month:String,

    status:{
        type:String,
        enum:[
            "Paid",
            "Pending"
        ]
    }

});


module.exports = mongoose.model("Payment", paymentSchema);