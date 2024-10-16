import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({

  inquiryId: {
    type: Number,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
  },

  phone: {
    type: Number,
    required: true,
  },

  inquiryDescription: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },

  inquiryReply: {
    type: String,
    required: false,
  },

  respondedAt: {
    type: Date,
    required: false,
  }
});

const Inquiry = mongoose.model("Inquiries", inquirySchema);

export default Inquiry;
