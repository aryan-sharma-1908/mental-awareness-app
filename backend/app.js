require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const connectDB = require('./database/database.js');
const loginRoute = require('./routes/login.route.js');
const registerRoute = require('./routes/register.route.js');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/register', registerRoute);
app.use('/login',loginRoute);

app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})

