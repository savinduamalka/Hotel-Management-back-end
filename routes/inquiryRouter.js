import express from 'express';
import { createInquiry } from '../controllers/inquiryController.js';


const inqiuiryRouter = express.Router();

inqiuiryRouter.post("/", (createInquiry));

export default inqiuiryRouter;