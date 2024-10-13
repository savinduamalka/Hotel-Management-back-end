import bodyParser from 'body-parser';
import express from 'express'
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import galleryItemsRoute from './routes/galleryItemsRoute.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import categoryRouter from './routes/categoryRouter.js';
import roomRouter from './routes/roomRoute.js';

dotenv.config();
const app = express();
app.use(bodyParser.json());
const connection = process.env.MONGO_URL;

//Authentication middleware
app.use((req,res,next)=>{
    const token =req.header("Authorization")?.replace("Bearer ","");
    
    if(token!=null){
        jwt.verify(token,process.env.JWT_SECRET,(error,decoded)=>{
        if(decoded!=null){
        req.user=decoded;
        next();
        }else{
            next();
        }
    })
    }else{
        next();
    }
});
app.use("/api/users",userRouter);
app.use("/api/gallery",galleryItemsRoute);
app.use("/api/categories",categoryRouter);
app.use("/api/room",roomRouter);


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