import mongoose from 'mongoose';

const otpSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
    enum: ['email_verification', 'password_reset'],
    default: 'email_verification',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 600, 
  },
});

const Otp = mongoose.model('otp', otpSchema);
export default Otp;
