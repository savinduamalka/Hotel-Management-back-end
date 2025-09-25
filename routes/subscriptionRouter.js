import express from 'express';
import { 
  subscribeEmail, 
  getAllSubscriptions,
} from '../controllers/subscriptionController.js';

const subscriptionRouter = express.Router();

// public
subscriptionRouter.post('/subscribe', subscribeEmail);

//admin only
subscriptionRouter.get('/all', getAllSubscriptions);

export default subscriptionRouter;
