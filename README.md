# Mental Awareness App

A full-stack web application for mental health awareness and anonymous community support, featuring real-time messaging and anonymous chat.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [API Routes](#api-routes)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

Mental Awareness App is designed to provide a safe, anonymous platform where users can:
- Share their mental health stories and experiences
- Connect with others through anonymous chat
- Access mental health resources and exercises
- Build a supportive community

---

## ✨ Features

### Frontend
- 🔐 User authentication (login/register)
- 👤 User profile setup and management
- 💬 Real-time chat with socket.io (anonymous and targeted)
- 🌟 Community feed for sharing posts
- 📚 Mental health resources and exercises
- 🔔 Unread message notifications with popups
- 📱 Responsive design with Tailwind CSS
- 🎨 Modern UI with Radix UI components

### Backend
- 🔒 JWT-based authentication with HttpOnly cookies
- 💾 MongoDB database with Mongoose ODM
- ⚡ Real-time messaging with Socket.IO
- 📨 Message read status tracking
- 👥 Chat list with unread counts
- 🛡️ CORS protection with whitelist validation
- 📝 Request logging with Morgan
- ✅ Input validation and error handling

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS + PostCSS
- **UI Components:** Radix UI, MUI, Lucide Icons
- **Routing:** React Router v6
- **Real-time:** Socket.IO Client
- **State Management:** React Context API
- **HTTP Client:** Fetch API
- **Notifications:** React Toastify

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Real-time:** Socket.IO Server
- **Security:** Cookie Parser, CORS, bcryptjs
- **Utilities:** Dotenv, Morgan (logging)

---

## 📁 Project Structure

```
mental-awareness-app/
├── backend/
│   ├── controllers/          # Route handlers
│   ├── database/             # MongoDB connection
│   ├── middlewares/          # Auth, validation
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API routes
│   ├── utils/                # Helper functions
│   ├── app.js                # Express app setup
│   ├── socket-server.js      # Socket.IO server
│   ├── package.json
│   ├── .env.example
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilities
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── config.js         # API config
│   ├── public/               # Static assets
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   ├── .env.example
│   └── ...
├── DEPLOYMENT.md             # Deployment guide
├── .gitignore
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account
- Git

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mental-awareness-app.git
   cd mental-awareness-app
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Setup environment variables**
   - Copy `backend/.env.example` to `backend/.env`
   - Copy `frontend/.env.example` to `frontend/.env`
   - Fill in your actual values (see [Environment Variables](#environment-variables))

5. **Start the servers**
   ```bash
   # Terminal 1: Backend
   cd backend
   npm run dev

   # Terminal 2: Frontend
   cd frontend
   npm run dev
   ```

6. **Open in browser**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5143

---

## 💻 Local Development

### Backend

```bash
cd backend

# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

**Features:**
- Hot reload with Nodemon
- Morgan request logging
- Mongoose validation

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Features:**
- Vite HMR (Hot Module Replacement)
- ESLint for code quality
- Automatic path resolution

---

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to:
- **Backend:** Render (Free tier supported)
- **Frontend:** Vercel (Free tier supported)
- **Database:** MongoDB Atlas (Free tier supported)

### Quick Deployment Checklist

- [ ] Create GitHub repository
- [ ] Add `MONGODB_URI` and `JWT_SECRET` to Render env vars
- [ ] Add `VITE_API_URL` to Vercel env vars
- [ ] Update `FRONTEND_URL` in Render env vars
- [ ] Test API and Socket.IO connection
- [ ] Verify chat functionality across tabs
- [ ] Monitor logs for errors

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000                    # Server port
MONGODB_URI=...             # MongoDB connection string
JWT_SECRET=...              # Secret for signing JWTs
JWT_EXPIRES_IN=7d           # JWT expiration
NODE_ENV=production         # Environment
FRONTEND_URL=...            # Frontend URL for CORS
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=...            # Backend API URL
VITE_CHAT_SERVER=...        # Socket.IO server URL
```

---

## 📡 API Routes

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user
- `GET /api/profile` - Get user profile

### Messaging (Socket.IO)
- `open_chat` - Open a chat with another user
- `send_message` - Send a message
- `new_message` - Receive messages in a chat room
- `incoming_message` - Receive notifications for unread messages
- `chats_list` - Get list of user's chats with unread counts

### Community
- `GET /api/community` - Get community posts
- `POST /api/community` - Create a new post

---

## 🐛 Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` is set correctly in backend env vars
- Check that frontend URL is in CORS whitelist

### Socket.IO Won't Connect
- Verify Socket.IO server is running (`/api/profile` should return 200)
- Check `VITE_API_URL` and `VITE_CHAT_SERVER` match backend URL
- Look for auth errors in browser console

### MongoDB Connection Fails
- Verify connection string in `MONGODB_URI`
- Add your IP to MongoDB Atlas IP Whitelist
- Check network connectivity

### Build Errors
- Clear `node_modules` and reinstall: `npm install`
- Delete build caches: `rm -rf dist build`
- Check Node.js version compatibility

---

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License - see `package.json` for details.

---

## 👥 Support

For support, email or open an issue on GitHub.

---

**Made with ❤️ for mental health awareness**
