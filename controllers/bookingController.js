import { error } from 'console';
import Booking from '../models/bookingModel.js';
import { checkAdmin, checkCustomer } from './userController.js';


export function createBooking(req, res) {
    if (!checkCustomer(req)) {
        console.log(req.user.type);
        res.status(403).json({
            message: "Please login as a customer to continue the booking"
        });
        return;
    }
    
    const starting = 1000;

    Booking.findOne({
        roomId: req.body.roomId,
        $or: [
            { startDate: { $lte: req.body.endDate }, endDate: { $gte: req.body.startDate } }
        ]
    })
    .then((existingBooking) => {
        if (existingBooking) {
            return res.status(409).json({
                message: "Room is already booked for the selected dates",
                existingBooking
            });
        }

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
            });
    })
    .catch((error) => {
        res.json({
            message: "Booking check failed",
            error: error
        });
    });
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

export function cancelBooking(req, res) {
    if (!checkAdmin(req)) {
        res.json({
            message: "You are not authorized to update this booking"
        });
        return;
    }

    const newStatus = req.body.status; // status sent from the frontend
    const newReason = req.body.reason || ""; // optional reason for the update

    Booking.findOneAndUpdate(
        { bookingId: req.params.bookingId },
        { status: newStatus, reason: newReason },
        { new: true }
    )
    .then(result => {
        res.json({
            message: "Booking status updated successfully",
            result: result
        });
    })
    .catch(err => {
        res.status(500).json({
            message: "Failed to update the booking",
            error: err
        });
    });
}


export function confirmBooking(req,res){
    if(!checkAdmin(req)){
        res.json({
            message: "You can not confirm a booking"
        })
        return;
    }
    Booking.findOneAndUpdate({bookingId:req.params.bookingId},{status:"Confirmed"},{new:true})
    .then(
        (result)=>{
            res.json({
                message:"Booking confirmed successfully",
                result: result
            });
        }
    ).catch(
        (err)=>{
            res.status(500).json({
                message: "Failed to confirm the booking",
                error: err
            });
        }
    )
}

export function deleteBooking(req,res){
    if(!checkCustomer(req)){
       return res.status(403).json({
            message: "You are not allowed to delete booking"
        });
    }
    Booking.findOneAndDelete({bookingId:req.params.bookingId})
    .then(
        (result)=>{
            if(!result){
                return res.json({
                    message:"Can't find the booking"
                })
            }
        res.json({
            message:"Booking deleted successfully",
            DeletedBooking : result
        });
    })
    .catch(
        (err)=>{
            res.status(500).json({
                message:"Failed to delete the booking",
                error:err
            })
        }
    )
}

export default function getFilteredData(req, res) {
    
    if (!checkAdmin(req)) {
        return res.status(403).json({
            message: "You are not allowed to access this data"
        });
    }

    Booking.find({
        startDate: { $lte: req.body.endDate },
        endDate: { $gte: req.body.startDate }
    })
    .then(result => {
        if (result.length === 0) {
            return res.status(404).json({
                message: "No bookings found for the specified date range",
                list: result
            });
        }
        
        res.json({
            message: "Filtered data according to the date range",
            list: result
        });
    })
    .catch(err => {
        res.status(500).json({
            message: "Failed to get the filtered data",
            error: err
        });
    });
}
