import express from 'express';
import { createInquiry, getInquiry } from '../controllers/inquiryController.js';



const inqiuiryRouter = express.Router();

inqiuiryRouter.post("/", (createInquiry));
inqiuiryRouter.get("/", getInquiry);

export default inqiuiryRouter;