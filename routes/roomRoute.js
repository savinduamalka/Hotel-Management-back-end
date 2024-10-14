import express from 'express';
import { createRoom, deleteRoomByRoomId, getRoom, getRoomByCategory, getRoomByRoomId } from '../controllers/roomController.js';

const roomRouter = express.Router();

roomRouter.post("/",createRoom);
roomRouter.get("/",getRoom);
roomRouter.get("/by-category/:category",getRoomByCategory)
roomRouter.get("/:RoomId",getRoomByRoomId);
roomRouter.delete("/:RoomId",deleteRoomByRoomId);


export default roomRouter;