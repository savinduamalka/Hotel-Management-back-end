import express from 'express';
import { 
  subscribeEmail
} from '../controllers/subscriptionController.js';

const subscriptionRouter = express.Router();

// public
subscriptionRouter.post('/subscribe', subscribeEmail);


export default subscriptionRouter;
