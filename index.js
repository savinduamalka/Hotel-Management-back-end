import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import galleryItemsRoute from './routes/galleryItemsRoute.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import categoryRouter from './routes/categoryRouter.js';
import roomRouter from './routes/roomRoute.js';
import bookingRouter from './routes/bookingRouter.js';
import inqiuiryRouter from './routes/inquiryRouter.js';
import feedbackRouter from './routes/feedbackRouter.js';
import subscriptionRouter from './routes/subscriptionRouter.js';
import cors from 'cors';
import { verifyEmailConfig } from './utils/emailService.js';

dotenv.config();
const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://hotel-management-front-b5g8wg1iv-savindu-amalkas-projects.vercel.app',
  'http://localhost:5173', 
  'https://brock-unbotanical-sona.ngrok-free.dev',
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg =
        'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

app.use(bodyParser.json());
const connection = process.env.MONGO_URL;

// Authentication middleware
app.use((req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      req.user = decoded;
      next();
    });
  } else {
    next();
  }
});

app.use('/api/users', userRouter);
app.use('/api/gallery', galleryItemsRoute);
app.use('/api/categories', categoryRouter);
app.use('/api/room', roomRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/inquiry', inqiuiryRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/subscription', subscriptionRouter);

mongoose
  .connect(connection)
  .then(() => {
    console.log('Success connect with database');
    // Verify email configuration on startup
    verifyEmailConfig();
  })
  .catch(() => {
    console.log('Fail connect with database');
  });

app.listen(3000, (resp, req) => {
  console.log('Server is running of port 3000');
});
