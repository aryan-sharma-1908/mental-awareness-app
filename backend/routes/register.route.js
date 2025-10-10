const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const router = express.Router();
const emailRegexSafe = require("email-regex-safe");

router.post("/", async (req, res) => {
  const { password, email } = req.body;

  if (!password || !email) {
    return res.status(400).json({
      message: "Email and password are required",
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

  try {
    const duplicateUser = await userModel.findOne({ email: email });
    if (duplicateUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const newUser = new userModel({
      email: email,
      password: password,
    });

    await newUser.save();

    const token = jwt.sign(
      {
        id: newUser._id,
        email: email,
      },
      {
        jwtSecret: process.env.JWT_SECRET,
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
      },
    });
  } catch (error) {
    console.error("Error occurred during registration:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

const handleRegister = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('/register', {
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      })
    })

    const data = await response.json();

    if(data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user',JSON.stringify(data.user));
      alert('Registration successful!'); 
    }
  } catch (error) {
    console.error('Error during registration:', error);
    alert('An error occurred. Please try again later.')
  }

}

module.exports = router;
