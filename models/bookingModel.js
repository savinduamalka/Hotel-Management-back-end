import mongoose from "mongoose";


const bookingSchema = mongoose.Schema({
    bookingId: {
        type: String,
        required: true,
        unique:true
    },
    email:{
        type: String,
        required:true
    },
    roomId:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        required:true,
        default: "Pending"
    },
    reason:{
        type:String,
        default:""
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    notes:{
        type:String,
        default:""
    },
    bookedAt:{
        type:Date,
        default:Date.now,
    }
});

const Booking = mongoose.model("bookings",bookingSchema);

export default Booking;