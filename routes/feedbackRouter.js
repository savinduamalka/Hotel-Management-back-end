import express from 'express';
import { createFeedback,  updateFeedbackVisibility } from '../controllers/feedbackController.js';

const feedbackRouter = express.Router();

feedbackRouter.post("/", createFeedback);
feedbackRouter.put("/:feedbackId", updateFeedbackVisibility);



export default feedbackRouter;