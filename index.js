import bodyParser from 'body-parser';
import express from 'express'
import { connect } from 'http2';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';


const app = express();
app.use(bodyParser.json());
app.use("/api/users",userRouter);

const connection ="mongodb+srv://user1:123@cluster0.lynjp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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