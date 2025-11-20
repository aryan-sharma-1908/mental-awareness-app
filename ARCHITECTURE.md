# Architecture & Deployment Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           PRODUCTION DEPLOYMENT                      │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ USER'S BROWSER                                                       │
│ ┌────────────────────────────────────────────────────────────────┐  │
│ │ https://mental-awareness-app.vercel.app                        │  │
│ │ (Frontend - React + Vite)                                      │  │
│ │                                                                │  │
│ │ Environment Variables:                                         │  │
│ │ - VITE_API_URL = https://your-service.onrender.com           │  │
│ │ - VITE_CHAT_SERVER = https://your-service.onrender.com       │  │
│ └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
            (HTTP/REST)               (WebSocket)
                    │                             │
                    ▼                             ▼
┌──────────────────────────────────────────────────────────────────────┐
│ RENDER (Backend - Node.js)                                           │
│ https://your-service.onrender.com                                    │
│ ┌────────────────────────────────────────────────────────────────┐  │
│ │ Express Server + Socket.IO Server                              │  │
│ │                                                                │  │
│ │ Environment Variables:                                         │  │
│ │ - PORT = 5000                                                 │  │
│ │ - NODE_ENV = production                                       │  │
│ │ - MONGODB_URI = (MongoDB connection string)                   │  │
│ │ - JWT_SECRET = (random 32 character secret)                   │  │
│ │ - JWT_EXPIRES_IN = 7d                                         │  │
│ │ - FRONTEND_URL = https://mental-awareness-app.vercel.app     │  │
│ │                                                                │  │
│ │ Routes:                                                        │  │
│ │ - POST /api/register                                          │  │
│ │ - POST /api/login                                             │  │
│ │ - GET /api/profile                                            │  │
│ │ - POST /api/logout                                            │  │
│ │ - POST /api/chat (messages)                                   │  │
│ │ - Socket.IO: open_chat, send_message, incoming_message       │  │
│ └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
                            │
                            │ (HTTPS)
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────────┐
│ MONGODB ATLAS (Database)                                             │
│ ┌────────────────────────────────────────────────────────────────┐  │
│ │ MongoDB Cluster (M0 - Free Tier)                               │  │
│ │                                                                │  │
│ │ Collections:                                                   │  │
│ │ - users (authentication)                                       │  │
│ │ - chats (conversations)                                        │  │
│ │ - messages (chat messages)                                     │  │
│ │ - posts (community posts)                                      │  │
│ │                                                                │  │
│ │ Connection: mongodb+srv://user:pass@cluster.mongodb.net/      │  │
│ │                                                                │  │
│ │ IP Whitelist: 0.0.0.0/0 (or Render's static IP)             │  │
│ └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘

```

---

## Data Flow Diagram

### Authentication Flow
```
1. User fills login form
                    │
                    ▼
2. Frontend POSTs to /api/login
                    │
                    ▼
3. Backend verifies credentials in MongoDB
                    │
                    ▼
4. Backend creates JWT and sends HttpOnly cookie
                    │
                    ▼
5. Frontend stores JWT in localStorage
                    │
                    ▼
6. Frontend redirects to home page
```

### Real-Time Chat Flow
```
1. User A opens chat with User B
                    │
                    ▼
2. Frontend emits 'open_chat' via Socket.IO
                    │
                    ▼
3. Backend creates Chat document in MongoDB
                    │
                    ▼
4. Backend joins User A to 'chat_XXX' room
                    │
                    ▼
5. Backend sends unread chats_list to User A

─────────────────────────────────────────────

6. User A types message and clicks send
                    │
                    ▼
7. Frontend emits 'send_message' via Socket.IO
                    │
                    ▼
8. Backend saves message to MongoDB
                    │
                    ▼
9. Backend emits 'new_message' to chat room
   AND emits 'incoming_message' to User B's personal room
   AND updates chats_list for both users
                    │
                    ├─────────────┬────────────────┐
                    ▼             ▼                ▼
            User A sees     User B gets      Both see
            message in      notification      updated
            chat            popup             unread
```

---

## Directory Structure

```
mental-awareness-app/
│
├── .gitignore                          # Excludes node_modules, .env
├── README.md                           # Main project documentation
├── DEPLOYMENT.md                       # Comprehensive deployment guide
├── QUICK_DEPLOY.md                     # Quick reference
├── DEPLOYMENT_CHECKLIST.md             # Step-by-step checklist
├── DEPLOYMENT_SUMMARY.md               # Summary of all steps
├── ENV_VARIABLES.md                    # Environment variable reference
│
├── backend/
│   ├── .env                            # ⚠️ Not committed (local only)
│   ├── .env.example                    # Template for .env
│   ├── package.json
│   ├── app.js                          # Express app setup
│   ├── socket-server.js                # Socket.IO server
│   │
│   ├── controllers/
│   │   ├── login.controller.js         # Login handler
│   │   ├── register.controller.js      # Registration handler
│   │   ├── profile.controller.js       # Profile handler
│   │   ├── logout.controller.js        # Logout handler
│   │   ├── post.controller.js          # Community posts
│   │   └── chat.controller.js          # Chat handler
│   │
│   ├── models/
│   │   ├── user.model.js               # User schema
│   │   ├── chat.model.js               # Chat schema
│   │   ├── message.model.js            # Message schema
│   │   └── post.model.js               # Community post schema
│   │
│   ├── routes/
│   │   ├── login.route.js
│   │   ├── register.route.js
│   │   ├── profile.route.js
│   │   ├── logout.route.js
│   │   ├── chat.routes.js
│   │   └── post.route.js
│   │
│   ├── middlewares/
│   │   └── auth.middleware.js          # JWT verification
│   │
│   ├── database/
│   │   └── database.js                 # MongoDB connection
│   │
│   └── utils/
│       └── genAnonName.js              # Anonymous name generator
│
├── frontend/
│   ├── .env                            # ⚠️ Not committed (local only)
│   ├── .env.example                    # Template for .env
│   ├── package.json
│   ├── index.html                      # Entry HTML
│   ├── vite.config.js                  # Vite configuration
│   ├── tailwind.config.js              # Tailwind CSS config
│   │
│   ├── src/
│   │   ├── main.jsx                    # Entry point
│   │   ├── App.jsx                     # Root component
│   │   ├── config.js                   # API config
│   │   ├── index.css                   # Global styles
│   │   │
│   │   ├── components/
│   │   │   ├── AuthContext.jsx         # Auth state management
│   │   │   ├── ChatBox.jsx             # Chat widget
│   │   │   ├── Navbar.jsx              # Navigation
│   │   │   ├── Logo.jsx                # Logo component
│   │   │   ├── Footer.jsx              # Footer
│   │   │   └── ui/                     # Radix UI components
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       └── progress.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── ProfileSetup.jsx
│   │   │   ├── Community.jsx
│   │   │   ├── Exercises.jsx
│   │   │   ├── LearnMore.jsx
│   │   │   └── SurveyForm.jsx
│   │   │
│   │   ├── hooks/
│   │   │   └── useChat.js              # Socket.IO and chat logic
│   │   │
│   │   └── lib/
│   │       └── utils.ts                # Utility functions
│   │
│   └── public/                         # Static assets
│       ├── boy.png
│       ├── girl.png
│       └── ...

```

---

## Deployment Timeline

```
Week 1: Preparation
├── ✅ Code changes (update CORS whitelist)
├── ✅ Create documentation
├── ✅ Create .env.example files
└── ✅ Push to GitHub

Week 1-2: Setup & Deployment (estimated 30 minutes)
├── 5 min: MongoDB Atlas cluster & user setup
├── 10 min: Render backend deployment + env vars
├── 5 min: Vercel frontend deployment + env vars
├── 2 min: Update Render FRONTEND_URL
└── 5 min: Testing and verification

Ongoing: Maintenance
├── Monitor logs on Render and Vercel
├── Update dependencies monthly
├── Check MongoDB Atlas alerts
└── Review and respond to user issues
```

---

## Environment Variables at a Glance

```
GITHUB PUSH
    │
    ▼
┌────────────────────────────────────┐
│ Render Environment                 │
├────────────────────────────────────┤
│ PORT=5000                          │
│ NODE_ENV=production                │
│ MONGODB_URI=mongodb+srv://...      │
│ JWT_SECRET=<32 random chars>       │
│ JWT_EXPIRES_IN=7d                  │
│ FRONTEND_URL=https://vercel.app   │
└────────────────────────────────────┘
           │         │
           │         └────────────────┐
           │                          │
           ▼                          ▼
    Backend runs          CORS whitelist
    Socket.IO             includes Vercel
    listens on 5000       frontend domain


┌────────────────────────────────────┐
│ Vercel Environment                 │
├────────────────────────────────────┤
│ VITE_API_URL=https://render.com   │
│ VITE_CHAT_SERVER=https://render   │
└────────────────────────────────────┘
           │
           ▼
    Frontend points
    to Render backend
    for API & Socket
```

---

## Certificate & Security

```
┌──────────────────────────────────────────┐
│ HTTPS (SSL/TLS)                          │
├──────────────────────────────────────────┤
│ Vercel:  Automatic free SSL              │
│          *.vercel.app domain             │
│                                          │
│ Render:  Automatic free SSL              │
│          *.onrender.com domain           │
│                                          │
│ Result:  🔒 Secure end-to-end           │
│          ✅ No certificate warnings     │
│          ✅ Socket.IO uses WSS          │
└──────────────────────────────────────────┘
```

---

**This architecture ensures:**
- 🚀 **Fast deployment** on free tiers
- 🔒 **Secure** HTTPS everywhere
- 📊 **Scalable** - can upgrade tiers easily
- 💰 **Cost-effective** - all free services available
- 📈 **Reliable** - established platforms
- 🔧 **Maintainable** - clear documentation

