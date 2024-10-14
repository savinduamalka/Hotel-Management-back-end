import express from 'express';
import { createRoom, getRoom } from '../controllers/roomController.js';

const roomRouter = express.Router();

roomRouter.post("/",createRoom);
roomRouter.get("/",getRoom);

export default roomRouter;