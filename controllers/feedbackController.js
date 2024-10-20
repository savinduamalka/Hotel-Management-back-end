import Feedback from "../models/feedbackModel.js";
import { checkAdmin, checkCustomer } from "./userController.js";

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

export function updateFeedbackVisibility(req, res) {
  if (!checkAdmin(req)) {
    return res.status(403).json({
      message: "Unauthorized access, only admin can update feedback visibility",
    });
  }

  Feedback.findOneAndUpdate(
    { feedbackId: req.params.feedbackId },
    { visibility: req.body.visibility },
    { new: true }
  )
    .then((result) => {
      res.json({
        message: "Feedback visibility updated successfully",
        feedback: result,
      });
    })
    .catch((error) => {
      res.json({
        message: "Failed to update feedback visibility",
        error: error,
      });
    });
}

export function getFeedback(req, res) {
  if (checkAdmin(req)) {
    Feedback.find({})
      .then((result) => {
        res.json({
          message: "All feedbacks",
          feedbacks: result,
        });
      })
      .catch((error) => {
        res.json({
          message: "Failed to get feedbacks",
          error: error,
        });
      });
  } else {
    Feedback.find({ email: req.user.email })
      .then((result) => {
        res.json({
          message: "Feedbacks by customer : " + req.user.email,
          feedbacks: result,
        });
      })
      .catch((error) => {
        res.json({
          message: "Failed to get feedbacks",
          error: error,
        });
      });
  }
}

export function deleteFeedback(req, res) {
  if (checkCustomer(req)) {
    Feedback.findOneAndDelete({
      feedbackId: req.params.feedbackId, email: req.user.email})
      .then((result) => {
        if (result) {
          res.json({
            message: "Feedback deleted successfully",
            deleted_Feedback: result,
          });
        } else {
          res.status(403).json({
            message: "You can only delete feedback that you posted",
          });
        }
      })
      .catch((err) => {
        res.json({
          message: "Feedback deletion failed",
          error: err,
        });
      });
  } else if (checkAdmin(req)) {
    Feedback.findOneAndDelete({ feedbackId: req.params.feedbackId })
      .then((result) => {
        res.json({
          message: "Feedback deleted successfully by admin",
          deleted_Feedback: result,
        });
      })
      .catch((err) => {
        res.json({
          message: "Feedback deletion failed",
          error: err,
        });
      });
  } else {
    res.status(403).json({
      message: "Unauthorized to delete feedback",
    });
  }
}

export function getAllFeedbacks(req, res) {
  Feedback.find({})
    .then((result) => {
      res.json({
        message: "All feedbacks",
        feedbacks: result,
      });
    })
    .catch((error) => {
      res.json({
        message: "Failed to get feedbacks",
        error: error,
      });
    });
}


