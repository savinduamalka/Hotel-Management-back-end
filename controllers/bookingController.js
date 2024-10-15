import { error } from 'console';
import Booking from '../models/bookingModel.js';
import { checkAdmin, checkCustomer } from './userController.js';


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

export function getBooking(req,res){
    if(checkAdmin(req)){
        Booking.find().then(
            (result)=>{
                res.json({
                    message: "Getting all booking details successfully",
                    list: result
                });
            }
        ).catch(
            (err)=>{
                res.status(500).json({
                    message: "Failed to get details of booking",
                    error:err
                });
            }
        )
    }else if(checkCustomer(req)){
        Booking.find({email:req.user.email}).then(
            (result)=>{
                res.json({
                    message: "Booking details according to User Email : " +req.user.email,
                    list: result
                })
            }
        ).catch(
            (err)=>{
                res.status(500).json({
                    message: "Failed to get details of booking",
                    error: err
                })
            }
        )
    }else{
        res.status(403).json({
            message: "Access denied. Please login first"
        })
    }
}
