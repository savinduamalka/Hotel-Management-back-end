import bodyParser from 'body-parser';
import express from 'express'
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
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
const connection = process.env.MONGO_URL;

// Authentication middleware
app.use((req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
  
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
          return res.status(403).json({ message: "Invalid token" });
        }
        req.user = decoded;
        next();
      });
    } else {
      next();
    }
  });
  
app.use("/api/users",userRouter);
app.use("/api/gallery",galleryItemsRoute);
app.use("/api/categories",categoryRouter);
app.use("/api/room",roomRouter);
app.use("/api/booking",bookingRouter);
app.use("/api/inquiry",inqiuiryRouter);
app.use("/api/feedback",feedbackRouter);



mongoose.connect(connection).then(
    ()=>{
        console.log("Success");
    }
).catch(
    ()=>{
        console.log("Fail");
    }
)

app.listen(3000,(resp,req)=>{
    console.log("Server is running of port 3000");
})