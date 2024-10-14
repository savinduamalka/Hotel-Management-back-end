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
    });
    }
  ).catch(
    (error)=>{
      res.status(500).json({
        message: "Failed to retrieve room",
        error:error
      });
    }
  );
}

export function getRoomByCategory(req,res){
  Room.find({category:req.params.category})
  .then(
    (result)=>{
      if(result.length===0){ //find function will return an array, so if there is no result, the condition of !result become false, thats why checked length here
        res.status(404).json({
          message: "No category available with entered Category name"
        })
        return;
      }
      res.json({
        message: "Rooms find by category name Successfully",
        list:result
      })
    }
  ).catch(
    (error)=>{
      res.status(500).json({
        message: "Rooms find by category name Failed!",
        error:error
      });
    }
  );
}