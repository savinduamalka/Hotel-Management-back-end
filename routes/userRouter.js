import express from 'express'
import { deleteRequest, getRequest, loginUsers, postRequest, putRequest } from '../controllers/userController.js';

const userRouter=express.Router();

userRouter.get("/", getRequest);
userRouter.post("/", postRequest);
userRouter.put("/", putRequest);
userRouter.delete("/", deleteRequest);
userRouter.post("/login", loginUsers);


export default userRouter;