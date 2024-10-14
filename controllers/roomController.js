import Room from "../models/roomModel.js";
import { checkAdmin } from "./userController.js";

export function createRoom(req, res) {
  if (!checkAdmin(req)) {
    res.status(403).json({
      message: "You are not Authorized to create Rooms",
    });
    return;
  }

  const newRoom = new Room(req.body);

  newRoom
    .save()
    .then((result) => {
      res.json({
        message: "Room Created Successfully",
        result: result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Can not create a Room",
        error: error,
      });
    });
}

export function getRoom(req, res) {
  Room.find().then(
    (result) => {
    res.json({
      list: result,
    });
  }).catch(
    (err)=>{
      res.status(500).json({
        message: "Failed to retrieve rooms",
        err:err
      })
    }
  )
}


export function getRoomByRoomId(req,res){
  Room.findOne({RoomId:req.params.RoomId},)
  .then(
    (result)=>{
      if(!result){
        res.status(404).json({
          message: "No Room available with entered Room Id"
        });
        return;
      }
      res.json({
      message:"Room retrieved Successfully",
      room:result
    })
    }
  ).catch(
    (error)=>{
      res.status(500).json({
        message: "Failed to retrieve room",
        error:error
      })
    }
  )
}
