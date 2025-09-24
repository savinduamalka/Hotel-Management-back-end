import express from 'express';
import { createInquiry, deleteInquiry, getInquiry, publicInquiry, updateInquiryReply } from '../controllers/inquiryController.js';



const inqiuiryRouter = express.Router();

inqiuiryRouter.post("/", (createInquiry));
inqiuiryRouter.get("/", getInquiry);
inqiuiryRouter.put("/:inquiryId", updateInquiryReply);
inqiuiryRouter.delete("/:email", deleteInquiry);
inqiuiryRouter.post("/public-inquiry", publicInquiry);

export default inqiuiryRouter;