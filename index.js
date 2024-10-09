import bodyParser from 'body-parser';
import express from 'express'
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import galleryItemsRoute from './routes/galleryItemsRoute.js';
import jwt from 'jsonwebtoken';


const app = express();
app.use(bodyParser.json());
const connection ="mongodb+srv://user1:123@cluster0.lynjp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

//Authentication middleware
app.use((req,res,next)=>{
    const token =req.header("Authorization")?.replace("Bearer ","");
    
    if(token!=null){
        jwt.verify(token,"secret",(error,decoded)=>{
        if(decoded!=null){
        req.body.user=decoded;
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