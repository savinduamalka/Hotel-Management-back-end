import express from 'express';
import { createFeedback,  deleteFeedback,  getAllFeedbacks,  getFeedback,  updateFeedbackVisibility } from '../controllers/feedbackController.js';

const feedbackRouter = express.Router();

feedbackRouter.post("/", createFeedback);
feedbackRouter.put("/:feedbackId", updateFeedbackVisibility);
feedbackRouter.get("/",getFeedback);
feedbackRouter.delete("/:feedbackId",deleteFeedback);
feedbackRouter.get("/",getAllFeedbacks);



export default feedbackRouter;