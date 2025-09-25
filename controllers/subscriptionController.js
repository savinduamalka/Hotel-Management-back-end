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

// Get all subscriptions (Admin only)
export function getAllSubscriptions(req, res) {
  // Check if user is authenticated
  if (!req.user) {
    return res.status(401).json({
      message: 'User not authenticated'
    });
  }

  // Check if user is admin
  if (req.user.type !== 'admin') {
    return res.status(403).json({
      message: 'Access denied. Admin privileges required.'
    });
  }

  // Fetch all active subscriptions
  Subscription.find({ isActive: true })
    .sort({ subscriptionDate: -1 })
    .then((subscriptions) => {
      res.json({
        message: 'All email subscriptions',
        count: subscriptions.length,
        subscriptions: subscriptions
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Failed to fetch subscriptions',
        error: error.message
      });
    });
}