import express from 'express';
import { createRoom, getRoom, getRoomByCategory, getRoomByRoomId } from '../controllers/roomController.js';

const roomRouter = express.Router();

roomRouter.post("/",createRoom);
roomRouter.get("/",getRoom);
roomRouter.get("/by-category/:category",getRoomByCategory)
roomRouter.get("/:RoomId",getRoomByRoomId);


export default roomRouter;