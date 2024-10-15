import express from 'express';
import { cancelBooking, confirmBooking, createBooking, deleteBooking, getBooking } from '../controllers/bookingController.js';

const bookingRouter = express.Router();

bookingRouter.post("/",createBooking);
bookingRouter.get("/",getBooking);
bookingRouter.put("/approve/:bookingId",confirmBooking);
bookingRouter.put("/:bookingId",cancelBooking);
bookingRouter.delete("/:bookingId",deleteBooking);


export default bookingRouter;