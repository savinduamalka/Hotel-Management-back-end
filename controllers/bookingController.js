import Booking from '../models/bookingModel.js';


export function createBooking(req, res) {
    const starting = 1000;

    Booking.countDocuments({})
        .then((countDocuments) => {
            var bookingId = starting + countDocuments + 1;
            console.log(bookingId);
            console.log(countDocuments);
           
        })
}
