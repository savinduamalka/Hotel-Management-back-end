import mongoose from "mongoose";
import User from "../models/userModel.js";
import { error } from "console";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

// GET request handler
export function getRequest(req, res) {
  const email = req.body.email;
  User.find({ email: email })
    .then((u) => {
      res.json(u);
    })
    .catch((error) => {
      res.status(400).json({
        message: "An error has occured",
        error: error.message,
      });
    });
}

// POST request handler
export function postRequest(req, res) {
  const user = req.body;
  const password = user.password;
  const saltRound = 10;
  const hashPassword = bcrypt.hashSync(password, saltRound);
  user.password = hashPassword;
  const newUser = new User(user);

  newUser
    .save()
    .then(() => {
      res.json({
        message: "User created successfully",
      });
    })
    .catch((error) => {
      if (error.code === 11000) {
        res.status(400).json({
          message: "Email already exists, cannot create user",
        });
      } else {
        res.status(400).json({
          message: "User can't be created",
          error: error.message,
        });
      }
    });
}

// PUT request handler
export function putRequest(req, res) {
  const email = req.body.email;
  const updateData = req.body;

  User.findOneAndUpdate(
    { email: email }, // Search by email
    updateData, // Data to update
    { new: true, runValidators: true } // Options to return updated doc and apply validation(Update krpu gaman db eka refresh krnn kalin postman eke kelinma pennnawa)
  )
    .then((u) => {
      if (!u) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({
        message: "User updated successfully",
        user: u,
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: "Failed to update user",
        error: error.message,
      });
    });
}

// DELETE request handler
export function deleteRequest(req, res) {
  const email = req.body.email;
  User.deleteOne({ email: email })
    .then((u) => {
      res.json(u);
    })
    .catch((error) => {
      res.status(400).json({
        message: "An error has occured",
        error: error.message,
      });
    });
}

export function loginUsers(req, res) {
  const credential = req.body;
  const inputPassword = credential.password;

  User.findOne({ email: credential.email }).then((user) => {
    if (user == null) {
      res.status(403).json({
        message: "User cant find",
      });
    } else {
      const isPasswordMatch = bcrypt.compareSync(inputPassword, user.password);
      if (!isPasswordMatch) {
        res.status(403).json({
          message: "Password is incorrect",
        });
      } else {
        const payloader = {
          id: user._id,
          email: user.email,
          firstName: user.firstname,
          lastName: user.lastname,
          type: user.type,
          phone: user.phone,
        };
        const token = jwt.sign( payloader , process.env.JWT_SECRET, {
          expiresIn: "48h",
        });
        res.json({
          message: "Login Success",
          detailsofuser: user,
          token: token,
        });
      }
    }
  });
}

export function checkAdmin(req){
  if(!req.user){
    return false;
  }
  if(req.user.type != 'admin'){
    return false;
  }
  return true;
}

export function checkCustomer(req){
  if(!req.user){
    return false;
  }
  if(req.user.type!='customer'){
    return false;
  }
  return true;
}
