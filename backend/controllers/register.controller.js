const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const router = express.Router();
const emailRegexSafe = require("email-regex-safe");

const x = router.post("/", async (req, res) => {
  try {
  const {email, password, name} = req.body;

  if (!password || !email || !name) {
    return res.status(400).json({
      message: "Fullname, Email and password are required",
    });
  }

  if (!email.match(emailRegexSafe({ exact: true })) || email.length < 5) {
    return res.status(400).json({
      message: "Invalid email format",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters long",
    });
  }

    const duplicateUser = await userModel.findOne({ email: email });
    if (duplicateUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const newUser = new userModel({
      email: email,
      password: password,
      name: name // Add if you want to store name
    });

    await newUser.save();

    // FIXED: Correct JWT signing syntax
    const token = jwt.sign(
      {
        id: newUser._id,
        email: email,
      },
      process.env.JWT_SECRET, // This should be the secret string directly
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: token,
      user: {
        id: newUser._id,
        email: email,
        name: name
      },
    });
  } catch (error) {
    console.error("Error occurred during registration:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
});

module.exports = router;