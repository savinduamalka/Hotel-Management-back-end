import express from 'express';
import { createBooking, getBooking } from '../controllers/bookingController.js';

const bookingRouter = express.Router();

bookingRouter.post("/",createBooking);
bookingRouter.get("/",getBooking);

export default bookingRouter;