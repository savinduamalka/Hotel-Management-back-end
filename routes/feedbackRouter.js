import express from 'express';
import { createFeedback,  getFeedback,  updateFeedbackVisibility } from '../controllers/feedbackController.js';

const feedbackRouter = express.Router();

feedbackRouter.post("/", createFeedback);
feedbackRouter.put("/:feedbackId", updateFeedbackVisibility);
feedbackRouter.get("/",getFeedback);



export default feedbackRouter;