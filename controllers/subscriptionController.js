import Subscription from '../models/subscriptionModel.js';

// Subscribe a new email
export function subscribeEmail(req, res) {
  const { email } = req.body;

  // Validate email input
  if (!email) {
    return res.status(400).json({
      message: 'Email is required'
    });
  }

  // Create new subscription
  const newSubscription = new Subscription({ email });

  newSubscription.save()
    .then(() => {
      res.json({
        message: 'Successfully subscribed to our newsletter!'
      });
    })
    .catch((error) => {
      if (error.code === 11000) {
        res.status(400).json({
          message: 'This email is already subscribed'
        });
      } else if (error.name === 'ValidationError') {
        res.status(400).json({
          message: 'Please enter a valid email address'
        });
      } else {
        res.status(500).json({
          message: 'Failed to subscribe',
          error: error.message
        });
      }
    });
}