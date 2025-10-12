require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const morgan = require('morgan');
const cookies = require('cookie-parser');
const connectDB = require('./database/database.js');
const loginController = require('./controllers/login.controller.js');
const registerController = require('./controllers/register.controller.js');
const profileRoute = require('./routes/profile.route.js');

const whiteList = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const corsOptions = {
    origin: function(origin, callback) {
         if(!origin) return callback(null, true);
        
        if(whiteList.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }, credentials: true
}
app.use(cookies());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));

app.use('/register', registerController);
app.use('/login', loginController);
app.use('/profile', profileRoute);

app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})

