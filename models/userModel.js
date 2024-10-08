import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true  
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true    
    }
});

// Create the "Users" model
const User = mongoose.model("Users", userSchema);

export default User;