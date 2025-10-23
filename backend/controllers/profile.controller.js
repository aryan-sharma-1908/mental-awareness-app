const express = require("express");
const User = require("../models/user.model");
const router = express.Router();
const jwt = require("jsonwebtoken");

exports.setupProfile = async (req, res) => {
  try {
    const { avatar, username } = req.body;

    if (!username) {
      console.error("Username is required");
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      console.error('User not found for profile setup');
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const existingUser = await User.findOne({
      username,
      _id: { $ne: user._id },
    });

    if (existingUser) {
      console.error('Username already taken');
      return res.status(400).json({
        success: false,
        message: "Username already taken",
      });
    }

    user.avatar = avatar || user.avatar;
    user.username = username || user.username;
    user.profileCompleted = true;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile setup successful",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        profileCompleted: user.profileCompleted
      },
    });
  } catch (error) {
    console.error("Profile setup error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if(!user) {
      console.error('User not found for profile retrieval');
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Profile fetched successfully',
      user
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    })
    console.error('Error fetching profile: ', error);
  }
}

