import mongoose from 'mongoose';
import User from '../models/userModel.js';
import Otp from '../models/otpModel.js';
import { error } from 'console';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import {
  generateOTP,
  sendOtpEmail,
  sendWelcomeEmail,
} from '../utils/emailService.js';

dotenv.config();

export function getRequest(req, res) {
  const userEmail = req.body.email;
  User.findOne({ email: userEmail })
    .select('-password')
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    })
    .catch((error) => {
      res.status(500).json({
        message: 'An error occurred while fetching user data',
        error: error.message,
      });
    });
}

export function postRequest(req, res) {
  const user = req.body;
  const { password, email, firstname } = user;

  // Validate required fields
  if (!password) {
    return res.status(400).json({
      message: 'Password is required',
    });
  }

  if (!email) {
    return res.status(400).json({
      message: 'Email is required',
    });
  }

  // Check if user already exists
  User.findOne({ email: email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).json({
          message: 'Email already exists, cannot create user',
        });
      }

      // Hash password and create user (but don't set emailVerified to true yet)
      const saltRound = 10;
      const hashPassword = bcrypt.hashSync(password, saltRound);
      user.password = hashPassword;
      user.emailVerified = false; // Ensure email is not verified initially

      const newUser = new User(user);

      // Save user first
      newUser
        .save()
        .then((savedUser) => {
          // Generate and send OTP
          const otp = generateOTP();

          // Save OTP to database
          const newOtp = new Otp({
            email: email,
            otp: otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
          });

          newOtp
            .save()
            .then(() => {
              // Send OTP email
              sendOtpEmail(email, otp, firstname)
                .then(() => {
                  res.status(201).json({
                    message:
                      'User created successfully. Please check your email for OTP verification.',
                    userId: savedUser._id,
                    email: savedUser.email,
                    requiresVerification: true,
                  });
                })
                .catch((emailError) => {
                  console.error('Email sending failed:', emailError);
                  res.status(201).json({
                    message:
                      'User created but email sending failed. Please request OTP again.',
                    userId: savedUser._id,
                    email: savedUser.email,
                    requiresVerification: true,
                  });
                });
            })
            .catch((otpError) => {
              console.error('OTP creation failed:', otpError);
              res.status(500).json({
                message: 'User created but OTP generation failed',
                error: otpError.message,
              });
            });
        })
        .catch((error) => {
          res.status(400).json({
            message: "User can't be created",
            error: error.message,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Database error',
        error: error.message,
      });
    });
}

// PUT request handler
export function putRequest(req, res) {
  const email = req.body.email;
  const updateData = req.body;

  // If password is being updated, validate the current password first
  if (updateData.password) {
    if (!updateData.currentPassword) {
      return res.status(400).json({
        message: 'Current password is required to change password',
      });
    }

    // First, find the user to validate current password
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: 'User not found' });
          return; // Stop execution here
        }

        // Validate current password
        const isCurrentPasswordMatch = bcrypt.compareSync(
          updateData.currentPassword,
          user.password
        );
        if (!isCurrentPasswordMatch) {
          res.status(400).json({
            message: 'Current password is incorrect',
          });
          return; // Stop execution here
        }

        // Hash the new password
        const saltRound = 10;
        const hashPassword = bcrypt.hashSync(updateData.password, saltRound);
        updateData.password = hashPassword;

        // Remove currentPassword from updateData as it shouldn't be saved
        delete updateData.currentPassword;

        // Now update the user with the new hashed password
        User.findOneAndUpdate({ email: email }, updateData, {
          new: true,
          runValidators: true,
        })
          .then((updatedUser) => {
            if (!updatedUser) {
              res.status(404).json({ message: 'User not found' });
              return;
            }

            const payloader = {
              id: updatedUser._id,
              email: updatedUser.email,
              firstName: updatedUser.firstname,
              lastName: updatedUser.lastname,
              type: updatedUser.type,
              image: updatedUser.image,
              whatsapp: updatedUser.whatsapp,
            };
            const token = jwt.sign(payloader, process.env.JWT_SECRET, {
              expiresIn: '48h',
            });

            res.json({
              message: 'User updated successfully',
              user: updatedUser,
              token: token,
            });
          })
          .catch((error) => {
            res.status(400).json({
              message: 'Failed to update user',
              error: error.message,
            });
          });
      })
      .catch((error) => {
        res.status(500).json({
          message: 'Failed to find user',
          error: error.message,
        });
      });
  } else {
    // If not updating password, proceed with normal update
    User.findOneAndUpdate(
      { email: email }, // Search by email
      updateData, // Data to update
      { new: true, runValidators: true } // Options to return updated doc and apply validation(Update krpu gaman db eka refresh krnn kalin postman eke kelinma pennnawa)
    )
      .then((u) => {
        if (!u) {
          return res.status(404).json({ message: 'User not found' });
        }

        const payloader = {
          id: u._id,
          email: u.email,
          firstName: u.firstname,
          lastName: u.lastname,
          type: u.type,
          image: u.image,
          whatsapp: u.whatsapp,
        };
        const token = jwt.sign(payloader, process.env.JWT_SECRET, {
          expiresIn: '48h',
        });

        res.json({
          message: 'User updated successfully',
          user: u,
          token: token,
        });
      })
      .catch((error) => {
        res.status(400).json({
          message: 'Failed to update user',
          error: error.message,
        });
      });
  }
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
        message: 'An error has occured',
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
        message: 'User not found',
      });
    } else {
      // Check if email is verified
      if (!user.emailVerified) {
        return res.status(403).json({
          message: 'Please verify your email before logging in',
          requiresVerification: true,
          email: user.email,
        });
      }

      const isPasswordMatch = bcrypt.compareSync(inputPassword, user.password);
      if (!isPasswordMatch) {
        res.status(403).json({
          message: 'Password is incorrect',
        });
      } else {
        const payloader = {
          id: user._id,
          email: user.email,
          firstName: user.firstname,
          lastName: user.lastname,
          type: user.type,
          image: user.image,
          whatsapp: user.whatsapp,
          emailVerified: user.emailVerified,
        };
        const token = jwt.sign(payloader, process.env.JWT_SECRET, {
          expiresIn: '48h',
        });
        res.json({
          message: 'Login Success',
          detailsofuser: user,
          token: token,
        });
      }
    }
  });
}

export function checkAdmin(req) {
  if (!req.user) {
    return false;
  }
  if (req.user.type != 'admin') {
    return false;
  }
  return true;
}

export function checkCustomer(req) {
  if (!req.user) {
    return false;
  }
  if (req.user.type != 'customer') {
    return false;
  }
  return true;
}

export function getAllUsers(req, res) {
  // Check if user is authenticated
  if (!req.user) {
    return res.status(401).json({
      message: 'User not authenticated',
    });
  }

  // Check if user is admin
  if (!checkAdmin(req)) {
    return res.status(403).json({
      message: 'Access denied. Admin privileges required.',
    });
  }

  // Fetch all users excluding password field
  User.find({})
    .select('-password')
    .then((users) => {
      res.json({
        message: 'All registered users',
        count: users.length,
        users: users,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Failed to fetch users',
        error: error.message,
      });
    });
}

// Verify OTP and activate user account
export function verifyOtp(req, res) {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      message: 'Email and OTP are required',
    });
  }

  // Find the OTP record
  Otp.findOne({ email: email, otp: parseInt(otp) })
    .then((otpRecord) => {
      if (!otpRecord) {
        return res.status(400).json({
          message: 'Invalid OTP or OTP not found',
        });
      }

      // Check if OTP has expired (additional check, MongoDB TTL should handle this too)
      if (otpRecord.expiresAt < new Date()) {
        return res.status(400).json({
          message: 'OTP has expired. Please request a new one.',
        });
      }

      // OTP is valid, update user's email verification status
      User.findOneAndUpdate(
        { email: email },
        { emailVerified: true },
        { new: true }
      )
        .then((updatedUser) => {
          if (!updatedUser) {
            return res.status(404).json({
              message: 'User not found',
            });
          }

          // Delete the OTP record after successful verification
          Otp.deleteOne({ _id: otpRecord._id })
            .then(() => {
              // Send welcome email
              sendWelcomeEmail(email, updatedUser.firstname).catch(
                (emailError) => {
                  console.error('Welcome email sending failed:', emailError);
                }
              );

              res.json({
                message:
                  'Email verified successfully! Your account is now active.',
                user: {
                  id: updatedUser._id,
                  email: updatedUser.email,
                  firstname: updatedUser.firstname,
                  lastname: updatedUser.lastname,
                  emailVerified: updatedUser.emailVerified,
                },
              });
            })
            .catch((deleteError) => {
              console.error('OTP deletion failed:', deleteError);
              // Still return success since verification was successful
              res.json({
                message:
                  'Email verified successfully! Your account is now active.',
                user: {
                  id: updatedUser._id,
                  email: updatedUser.email,
                  firstname: updatedUser.firstname,
                  lastname: updatedUser.lastname,
                  emailVerified: updatedUser.emailVerified,
                },
              });
            });
        })
        .catch((error) => {
          res.status(500).json({
            message: 'Failed to verify user',
            error: error.message,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Database error',
        error: error.message,
      });
    });
}

// Resend OTP
export function resendOtp(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: 'Email is required',
    });
  }

  // Check if user exists and is not verified
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      if (user.emailVerified) {
        return res.status(400).json({
          message: 'Email is already verified',
        });
      }

      // Delete any existing OTP for this email
      Otp.deleteMany({ email: email })
        .then(() => {
          // Generate new OTP
          const otp = generateOTP();

          // Save new OTP to database
          const newOtp = new Otp({
            email: email,
            otp: otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
          });

          newOtp
            .save()
            .then(() => {
              // Send OTP email
              sendOtpEmail(email, otp, user.firstname)
                .then(() => {
                  res.json({
                    message: 'OTP has been resent to your email address',
                    email: email,
                  });
                })
                .catch((emailError) => {
                  console.error('Email sending failed:', emailError);
                  res.status(500).json({
                    message: 'Failed to send OTP email',
                    error: emailError.message,
                  });
                });
            })
            .catch((otpError) => {
              res.status(500).json({
                message: 'Failed to generate OTP',
                error: otpError.message,
              });
            });
        })
        .catch((deleteError) => {
          res.status(500).json({
            message: 'Failed to clear existing OTP',
            error: deleteError.message,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Database error',
        error: error.message,
      });
    });
}
