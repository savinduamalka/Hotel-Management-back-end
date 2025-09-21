import express from 'express';
import { createFeedback,  deleteFeedback,  getAllFeedbacks,  getFeedback,  updateFeedbackVisibility, getPublicVisibleFeedbacks } from '../controllers/feedbackController.js';

const feedbackRouter = express.Router();

feedbackRouter.post("/", createFeedback);
feedbackRouter.put("/:feedbackId", updateFeedbackVisibility);
feedbackRouter.get("/",getFeedback);
feedbackRouter.delete("/:feedbackId",deleteFeedback);
feedbackRouter.get("/all",getAllFeedbacks);


feedbackRouter.get("/public-visible-feedbacks", getPublicVisibleFeedbacks);



export default feedbackRouter;