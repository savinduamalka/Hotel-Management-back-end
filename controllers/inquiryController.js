import Inquiry from "../models/inquiryModel.js";
import { checkAdmin, checkCustomer } from "./userController.js";

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

export function getInquiry(req, res) {
    if (!checkAdmin(req) && !checkCustomer(req)) {
      return res.status(403).json({
        message: "Unauthorized access, only admin or customer can view inquiries",
      });
    }
  
    if (checkAdmin(req)) {
      Inquiry.find()
        .then((inquiries) => {
          res.status(200).json({
            inquiries: inquiries,
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: "Failed to retrieve inquiries",
            error: error,
          });
        });
    } else {
      Inquiry.find({ email: req.user.email })
        .then((inquiries) => {
          res.status(200).json({
            inquiries: inquiries,
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: "Failed to retrieve inquiries",
            error: error,
          });
        });
    }
  }


export function updateInquiryReply(req, res) {
    if (!checkAdmin(req)) {
      return res.status(403).json({
        message: "Unauthorized access, only admin can update inquiries",
      });
    }
  
    const inquiryId = req.params.inquiryId;
    const inquiryReply = req.body.inquiryReply;
  
    Inquiry.findById(inquiryId)
      .then((inquiry) => {
        if (!inquiry) {
          return res.status(404).json({
            message: "Inquiry not found",
          });
        }
  
        inquiry.inquiryReply = inquiryReply;
        inquiry.respondedAt = new Date();
        inquiry.status = "Responded";
  
        return inquiry.save();
      })
      .then((updatedInquiry) => {
        res.status(200).json({
          message: "Inquiry updated successfully",
          inquiry: updatedInquiry,
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: "Failed to update inquiry",
          error: error,
        });
      });
    }

    export function deleteInquiry(req,res){
        if(!checkCustomer(req)){
            res.status(403).json({
                message: "Please login as a customer to delete the inquiry"
            });
            return;
        }
        Inquiry.findOneAndDelete({email:req.user.email})
        .then((result)=>{
            res.json({
                message: "Inquiry deleted successfully",
                inquiry: result
            });
        })
        .catch((error)=>{
            res.json({
                message: "Inquiry failed to delete",
                error: error
            });
        });
    }