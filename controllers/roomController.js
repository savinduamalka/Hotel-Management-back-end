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
