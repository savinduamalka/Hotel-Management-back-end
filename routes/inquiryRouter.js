import express from 'express';
import { createInquiry, deleteInquiry, getInquiry, updateInquiryReply } from '../controllers/inquiryController.js';



const inqiuiryRouter = express.Router();

inqiuiryRouter.post("/", (createInquiry));
inqiuiryRouter.get("/", getInquiry);
inqiuiryRouter.put("/:inquiryId", updateInquiryReply);
inqiuiryRouter.delete("/:email", deleteInquiry);

export default inqiuiryRouter;