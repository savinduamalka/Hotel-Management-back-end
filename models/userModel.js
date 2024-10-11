import mongoose from "mongoose";

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
   
});

// Create the "Users" model
const User = mongoose.model("Users", userSchema);

export default User;