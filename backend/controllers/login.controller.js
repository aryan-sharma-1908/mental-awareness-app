const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email: email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.cookie('token',token, {
      httpOnly: true, // true to prevent client-side JS from reading the cookie
      secure: process.env.NODE_ENV === 'production', // set to true if using HTTPS else false
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // set to 'None' for cross-site cookies and 'Lax' or 'Strict' for same-site cookies
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        profileCompleted: user.profileCompleted
      },
    });
  } catch (error) {
    console.error("Error occurred during login:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



