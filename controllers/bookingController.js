import Booking from '../models/bookingModel.js';
import { checkCustomer } from './userController.js';


export function createBooking(req, res) {
    if(!checkCustomer(req)){
        console.log(req.user.type);
        res.status(403).json({
            message: "Please login as a customer to continue the booking"
        });
        return;
    }
    const starting = 1000;

    Booking.countDocuments({})
        .then((countDocuments) => {
            var bookingId = starting + countDocuments + 1;
            console.log(bookingId);
            console.log(countDocuments);
           
            const newBooking = new Booking({
                bookingId,
                email: req.user.email,
                roomId: req.body.roomId,
                startDate: req.body.startDate,
                endDate: req.body.endDate
            });
            return newBooking.save();
        })
        .then((result) => {
            res.json({
                message: "Booking created successfully",
                result: result
            });
        })
        .catch((error) => {
            res.json({
                message: "Booking failed",
                error: error
            });
        }).catch();
}
