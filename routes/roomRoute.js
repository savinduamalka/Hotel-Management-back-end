import express from 'express';
import { createRoom, getRoom, getRoomByRoomId } from '../controllers/roomController.js';

const roomRouter = express.Router();

roomRouter.post("/",createRoom);
roomRouter.get("/",getRoom);
roomRouter.get("/:RoomId",getRoomByRoomId);

export default roomRouter;