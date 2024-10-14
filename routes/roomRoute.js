import express from 'express';
import { createRoom, deleteRoomByRoomId, getRoom, getRoomByCategory, getRoomByRoomId, updateRoomByRoomId } from '../controllers/roomController.js';

const roomRouter = express.Router();

roomRouter.post("/",createRoom);
roomRouter.get("/",getRoom);
roomRouter.get("/by-category/:category",getRoomByCategory)
roomRouter.get("/:RoomId",getRoomByRoomId);
roomRouter.delete("/:RoomId",deleteRoomByRoomId);
roomRouter.put("/:RoomId",updateRoomByRoomId);


export default roomRouter;