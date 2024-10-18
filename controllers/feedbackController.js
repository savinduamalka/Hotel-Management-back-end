import Feedback from "../models/feedbackModel.js";
import { checkCustomer } from "./userController.js";

export function createFeedback(req, res) {
  if (!checkCustomer(req)) {
    return res.status(403).json({
      message: "Please login as a customer to continue the feedback",
    });
  }

  Feedback.countDocuments({})
    .then((countDocuments) => {
      var feedbackId = countDocuments + 1;

      const feedback = new Feedback({
        feedbackId,
        email: req.user.email,
        rating: req.body.rating,
        feedback: req.body.feedback,
      });
      return feedback.save();
    })
    .then((result) => {
      res.json({
        message: "Feedback created successfully",
        feedback: result,
      });
    })
    .catch((error) => {
      res.json({
        message: "Feedback failed",
        error: error,
      });
    });
}
