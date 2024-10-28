import dotenv from "dotenv";
import mongoose from "mongoose";


dotenv.config();

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true    
    },
    password:{
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true  
    },
    lastname: {
        type: String,
        required: true
    },type: {
        type: String,
        required: true,
        default: "customer"
    },
    whatsapp: {
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    disable:{
        type: Boolean,
        required: true,
        default: false
    },
    emailVerified:{
        type: Boolean,
        required: true,
        default: false
    },
    image:{
        type:String,
        default: process.env.DEFAULT_PROFILE_IMAGE
    }
   
});


const User = mongoose.model("Users", userSchema);

export default User;