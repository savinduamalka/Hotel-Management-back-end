import express from 'express';
import {
  deleteRequest,
  getRequest,
  getAllUsers,
  loginUsers,
  postRequest,
  putRequest,
  verifyOtp,
  resendOtp,
  requestPasswordReset,
  resetPassword,
} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/', getRequest);
userRouter.post('/', postRequest);
userRouter.put('/', putRequest);
userRouter.delete('/', deleteRequest);
userRouter.post('/login', loginUsers);
userRouter.get('/all', getAllUsers);
userRouter.post('/verify-otp', verifyOtp);
userRouter.post('/resend-otp', resendOtp);
userRouter.post('/forgot-password', requestPasswordReset);
userRouter.post('/reset-password', resetPassword);

export default userRouter;
