require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const morgan = require("morgan");
const cookies = require("cookie-parser");
const connectDB = require("./database/database.js");
const registerRoute = require('./routes/register.route.js');
const profileRoute = require("./routes/profile.route.js");
const checkAuth = require("./middlewares/auth.middleware.js");
const loginRoute = require('./routes/login.route.js');
const postRoute = require('./routes/post.route.js');
const logoutRoute = require('./routes/logout.route.js');
const whiteList = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://www.mongodb.com/docs/atlas/security-whitelist",
  "https://mental-awareness-app.vercel.app",
  "https://mental-awareness-app-git-main-aryan-sharmas-projects-62cf0133.vercel.app",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (whiteList.indexOf(origin) !== -1) callback(null, true);
    else {
      console.warn(`Blocked by CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cookies());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Server is running");
});
app.use("/api/register", registerRoute);
app.use("/api/login", loginRoute);
app.use("/api/profile", profileRoute);
app.use("/api/community", postRoute);
app.use("/api/logout", logoutRoute);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
  });
