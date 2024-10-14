import { error } from "console";
import Room from "../models/roomModel.js";
import { checkAdmin } from "./userController.js";
import { stat } from "fs";

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

export function deleteRoomByRoomId(req,res){
  if(!checkAdmin(req)){
    res.json({
      message:"You are not authorized"
    })
    return;
  }

  Room.findOneAndDelete({RoomId:req.params.RoomId})
  .then(
    (result)=>{
      if(!result){
        res.json({
          message:"Can't find the Room"
        })
        return;
      }
      res.json({
        message:"Room Deleted Successfully",
        result:result
      })
    }
  ).catch(
    (error)=>{
      res.json({
        message:"Room Deletion failed",
        error:error
      });
    }
  );
}

export function updateRoomByRoomId(req,res){
  if(!checkAdmin(req)){
    res.status(403).json({
      message: "You are not authorized"
    })
    return;
  }

  const updatedRoom = req.body;
  if(Object.keys(updatedRoom).length===0){
    res.status(400).json({
      message: "No data provided to update the room"
    })
    return;
  }

  Room.findOneAndUpdate({RoomId:req.params.RoomId},updatedRoom,{new:true, runValidators: true}) // runValidators are doing checking the constraints such as dataType
  .then(
    (result)=>{
      if(!result){
        res.status(404).json({
          message:"Can not find Room"
        })
        return;
      }
      res.json({
        message: "Room Updated Successfully",
        result: result
      })
    }
  ).catch(
    (err)=>{
      res.status(500).json({
        message: "Room Updated Fail !",
        error: err
      })
    }
  )
}