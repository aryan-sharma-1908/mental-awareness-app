const express = require("express");
const userModel = require("../models/user.model");
const router = express.Router();
const jwt = require("jsonwebtoken");
router.post("/setup", async (req, res) => {
  try {
    const { avatar, username } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const existingUser = await userModel.findOne({
      username,
      _id: { $ne: user._id },
    });

    if (existingUser) {
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
});

module.exports = router;
