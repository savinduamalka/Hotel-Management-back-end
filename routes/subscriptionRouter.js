import express from 'express';
import { 
  subscribeEmail, 
  getAllSubscriptions,
  deleteSubscription 
} from '../controllers/subscriptionController.js';

const subscriptionRouter = express.Router();

// public
subscriptionRouter.post('/subscribe', subscribeEmail);

//admin only
subscriptionRouter.get('/all', getAllSubscriptions);
subscriptionRouter.delete('/delete', deleteSubscription);

export default subscriptionRouter;
