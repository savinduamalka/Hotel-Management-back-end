import express from 'express';
import { cancelBooking, createBooking, getBooking } from '../controllers/bookingController.js';

const bookingRouter = express.Router();

bookingRouter.post("/",createBooking);
bookingRouter.get("/",getBooking);
bookingRouter.put("/:bookingId",cancelBooking);

export default bookingRouter;