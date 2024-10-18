import { response } from "express";
import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    feedbackId:{
        type: String,
        required: true,
        uniqued: true,
    },
    email:{
        type: String,
        required: true,
    },
    rating:{
        type: Number,
        required: true,
    },
    feedback:{
        type: String,
        required: true,
    },
    feedbackDate:{
        type: Date,
        default: Date.now,
    },
    response:{
        type: String,
        default: "Thank you for your feedback",
    },
    visibility:{
        type: Boolean,
        default: false,
    }
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
