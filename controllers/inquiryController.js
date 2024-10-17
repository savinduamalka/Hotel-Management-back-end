import Inquiry from "../models/inquiryModel.js";
import { checkCustomer } from "./userController.js";

export function createInquiry(req,res){
    if(!checkCustomer(req)){
        res.status(403).json({
            message: "Please login as a customer to continue the inquiry"
        });
        return;
    }
 
    const starting = 10;
    Inquiry.countDocuments({})
        .then((countDocuments)=>{
            var inquiryId = starting + countDocuments + 1;

            const inquiry = new Inquiry({
                inquiryId,
                email: req.user.email,
                phone: req.user.phone,
                inquiryDescription: req.body.inquiryDescription
            });
            return inquiry.save();
        })
        .then((result)=>{
            res.json({
                message: "Inquiry created successfully",
                inquiry: result
            });
        })
        .catch((error)=>{
            res.json({
                message: "Inquiry failed",
                error: error
            });
        });
}