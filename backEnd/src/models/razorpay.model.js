const mongoose = require("mongoose");

const razorpaySchema = mongoose.Schema({
    razorpay_order_id :{
        type: String,
        required: true,
    },
    razorpay_payment_id :{
        type: String,
        required: true
    },
    razorpay_signature :{
        type: String,
        required: true
    }
})

const razorpayModel = mongoose.model("razorpay" , razorpaySchema);

module.exports = razorpayModel;
