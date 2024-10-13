import mongoose from 'mongoose';


const roomSchema = new mongoose.Schema({
  RoomId: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
  },
  maxGuest: {
    type: Number,
    required: true,
    default: 3,
  },
  available: {
    type: Boolean,
    required: true,
    default: true
  },
  images: [
    {
      type: String,
    }
  ],
  description: {
    type: String,
    default: "",
  },
  notes:{
    type:String,
    default:""
  }
});

const Room = mongoose.model("room",roomSchema);

export default Room;
