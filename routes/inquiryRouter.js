import express from 'express';
import { createInquiry, getInquiry, updateInquiryReply } from '../controllers/inquiryController.js';



const inqiuiryRouter = express.Router();

inqiuiryRouter.post("/", (createInquiry));
inqiuiryRouter.get("/", getInquiry);
inqiuiryRouter.put("/:inquiryId", updateInquiryReply);

export default inqiuiryRouter;