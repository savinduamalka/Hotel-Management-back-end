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
import menuRouter from './routes/menuRouter.js';

dotenv.config();
const app = express();

const rawFrontend = process.env.FRONTEND_URL || '';
const frontendOrigin = rawFrontend.trim().replace(/\/?$/, '');
if (!frontendOrigin) {
  console.warn(
    '[CORS] FRONTEND_URL not set. Only non-browser (no Origin) requests will be accepted.'
  );
}

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const normalized = origin.replace(/\/?$/, '');
    if (frontendOrigin && normalized === frontendOrigin) {
      return callback(null, true);
    }
    console.warn(`[CORS] Blocked origin: ${origin}`);
    return callback(null, false);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 

// ----- Body Parsing -----
app.use(bodyParser.json({ limit: '1mb' }));

// ----- Auth (non-blocking if no token) -----
app.use((req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return next();
  }
  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
});

// ----- Routes -----
app.use('/api/users', userRouter);
app.use('/api/gallery', galleryItemsRoute);
app.use('/api/categories', categoryRouter);
app.use('/api/room', roomRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/inquiry', inqiuiryRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/subscription', subscriptionRouter);
app.use('/api/menu', menuRouter);

// Healthcheck & diagnostics route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', dbState: mongoose.connection.readyState });
});

app.use((err, req, res, next) => {
  console.error('[ERROR]', err); // keep stack for server logs
  if (res.headersSent) {
    return next(err);
  }
  res
    .status(err.status || 500)
    .json({ message: err.message || 'Internal Server Error' });
});

// ----- Database & Server Startup -----
const connection = process.env.MONGO_URL;
const PORT = process.env.PORT || 3000;

if (!connection) {
  console.error('MONGO_URL not set in environment. Cannot start server.');
  process.exit(1);
}

mongoose
  .connect(connection, {
    // Add any desired options here
    autoIndex: true,
  })
  .then(() => {
    console.log('✅ Connected to database');
    verifyEmailConfig();
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
      console.log(
        'Allowed frontend origin:',
        frontendOrigin || '[NONE - only no-Origin requests]'
      );
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to database:', err.message);
    process.exit(1);
  });
