# Deployment Guide for Mental Awareness App

This guide covers deploying the frontend to **Vercel** and the backend to **Render**, and pushing code to **GitHub**.

---

## Table of Contents

1. [GitHub Setup](#github-setup)
2. [Backend Deployment (Render)](#backend-deployment-render)
3. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
4. [Code Changes Required](#code-changes-required)
5. [Environment Variables](#environment-variables)
6. [Post-Deployment Testing](#post-deployment-testing)

---

## GitHub Setup

### 1. Create a `.gitignore` (if not already present)

Ensure you have a `.gitignore` in both backend and frontend directories to exclude sensitive files:

**Backend `.gitignore`:**
```
node_modules/
.env
.env.local
.env.*.local
dist/
build/
*.log
.DS_Store
```

**Frontend `.gitignore`:**
```
node_modules/
dist/
build/
.env
.env.local
.env.*.local
.DS_Store
*.log
coverage/
.bolt/
```

### 2. Create a Root `.gitignore` (optional but recommended)

At the project root, create `.gitignore` to exclude node_modules:
```
node_modules/
.env
.env.local
.DS_Store
```

### 3. Initialize Git and Push to GitHub

```bash
# At project root
git init
git add .
git commit -m "Initial commit: Mental Awareness App"
git branch -M main
git remote add origin https://github.com/yourusername/mental-awareness-app.git
git push -u origin main
```

### 4. Remove Sensitive Data from Local `.env`

**⚠️ IMPORTANT:** Never commit `.env` files with credentials. Before pushing:
- Delete the `.env` file from your local repository (it's in `.gitignore`)
- Create a `.env.example` template (see below)

**Backend `.env.example`:**
```
PORT=5000
MONGODB_URI=<your_mongodb_atlas_uri>
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

**Frontend `.env.example`:**
```
VITE_API_URL=<your_render_backend_url>
VITE_CHAT_SERVER=<your_render_backend_url>
```

---

## Backend Deployment (Render)

### 1. Prepare Backend for Production

**Update `backend/app.js` CORS whitelist with Vercel URL:**

Replace the hardcoded CORS whitelist with environment-based config. Update lines 18-23:

```javascript
const whiteList = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL || "https://mental-awareness-app.vercel.app",
];
```

### 2. Create a `backend/.env.production` (Local Reference - DO NOT COMMIT)

For local testing before deployment:
```
PORT=5000
MONGODB_URI=<your_mongodb_atlas_uri>
JWT_SECRET=<strong_random_secret>
JWT_EXPIRES_IN=7d
NODE_ENV=production
FRONTEND_URL=https://mental-awareness-app.vercel.app
```

### 3. Sign Up and Create Render Web Service

1. Go to [render.com](https://render.com) and sign up
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Fill in the form:
   - **Name:** mental-awareness-app-backend (or similar)
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start` (or `node app.js`)
   - **Root Directory:** `backend`
   - **Plan:** Free tier (or upgrade for reliability)

### 4. Add Environment Variables in Render Dashboard

In the Render web service settings, go to **Environment** and add:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A strong random secret (e.g., `openssl rand -hex 32`) |
| `JWT_EXPIRES_IN` | `7d` |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://mental-awareness-app.vercel.app` (or your actual Vercel URL) |
| `PORT` | `5000` |

**Example MongoDB Atlas URI:**
```
mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

### 5. Deploy

Click **Create Web Service**. Render will automatically build and deploy from your GitHub repo.

**Your backend URL will be:** `https://your-service-name.onrender.com`

---

## Frontend Deployment (Vercel)

### 1. Update Frontend Config

**Update `frontend/src/config.js`** to use environment variable:

```javascript
const raw = import.meta.env.VITE_API_URL;

export const BASE_URL = (typeof raw === "string" && raw && raw !== "undefined" && raw !== "null")
  ? raw
  : "http://localhost:5143";

export default BASE_URL;
```

(This is already in place; no changes needed.)

### 2. Create `frontend/vite.config.js` (ensure it exists)

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### 3. Sign Up and Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click **New Project**
3. Select your GitHub repository
4. Fill in the form:
   - **Project Name:** mental-awareness-app-frontend (or similar)
   - **Framework:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### 4. Add Environment Variables in Vercel

Before deploying, set environment variables:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://your-service-name.onrender.com` |
| `VITE_CHAT_SERVER` | `https://your-service-name.onrender.com` |

Click **Deploy**.

**Your frontend URL will be:** `https://mental-awareness-app.vercel.app`

---

## Code Changes Required

### Backend Changes

#### 1. Update `backend/app.js` CORS Whitelist

**Change:** Use environment-based CORS origin validation

```javascript
const whiteList = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL || "https://mental-awareness-app.vercel.app",
];
```

#### 2. Ensure `backend/app.js` Starts HTTP Server Correctly

The existing code already does this correctly:
```javascript
const httpServer = require("http").createServer(app);
const io = startSocketServer(httpServer);

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
```

#### 3. Verify `backend/database/database.js`

Ensure it uses `process.env.MONGODB_URI`:

```javascript
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:' , error);
        process.exit(1);
    }
}

module.exports = connectDB;
```

(Already correct in your code.)

### Frontend Changes

#### 1. Verify `frontend/src/config.js`

Already correct. It reads `VITE_API_URL` from environment and falls back to localhost.

#### 2. Ensure `frontend/package.json` Has Correct Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

(Already correct in your code.)

---

## Environment Variables Summary

### Backend (Render)

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
NODE_ENV=production
FRONTEND_URL=https://mental-awareness-app.vercel.app
```

### Frontend (Vercel)

```env
VITE_API_URL=https://your-service-name.onrender.com
VITE_CHAT_SERVER=https://your-service-name.onrender.com
```

---

## Important Security Notes

1. **Never commit `.env` files** — Use `.env.example` as a template
2. **Use strong JWT secrets** — Generate with: `openssl rand -hex 32`
3. **Enable MongoDB IP Whitelist** — In MongoDB Atlas, whitelist all IPs (`0.0.0.0/0`) for Render, or use static IP if available
4. **HTTPS only** — Both Vercel and Render provide free SSL/TLS
5. **CORS** — Update the whitelist to match your production frontend URL
6. **Socket.IO** — Ensure the CORS settings in `backend/socket-server.js` allow your frontend origin:

   ```javascript
   const io = new Server(httpServer, {
     cors: { origin: true, credentials: true }
   });
   ```

   This is already permissive; for production, consider:
   ```javascript
   cors: { 
     origin: process.env.FRONTEND_URL || "http://localhost:5173",
     credentials: true 
   }
   ```

---

## Post-Deployment Testing

### 1. Test Backend API

```bash
curl https://your-service-name.onrender.com
# Should return: "Server is running"
```

### 2. Test Frontend

Open `https://mental-awareness-app.vercel.app` in a browser and verify:
- Pages load without 404 errors
- No CORS errors in console
- Socket.IO connects (check Network tab or devtools Console)

### 3. Test Chat Feature

1. Log in with two different accounts
2. Send a message from account A
3. Verify account B receives the notification pop-up and unread badge
4. Open the chat and verify messages sync

### 4. Monitor Logs

**Render:** Go to your Web Service → Logs to view backend logs
**Vercel:** Go to your Project → Deployments → select deployment → Logs

---

## Troubleshooting

### CORS Errors

**Error:** `Access to XMLHttpRequest at 'https://...' from origin 'https://...' has been blocked by CORS policy`

**Solution:**
1. Ensure `FRONTEND_URL` env var is set correctly on Render
2. Update `backend/app.js` CORS whitelist to include your Vercel URL

### Socket.IO Connection Fails

**Error:** `WebSocket is closed before the connection is established`

**Solution:**
1. Verify Socket.IO server is running: check Render logs
2. Ensure `VITE_CHAT_SERVER` and `VITE_API_URL` point to the same Render URL
3. Check browser Network tab for WebSocket handshake errors

### MongoDB Connection Fails

**Error:** `MongoServerSelectionError`

**Solution:**
1. Verify `MONGODB_URI` is correct
2. In MongoDB Atlas, add Render IP to IP Whitelist (or allow 0.0.0.0/0)
3. Check connection string includes `?retryWrites=true&w=majority`

### Build Fails on Vercel

**Check:**
1. Vercel root directory is set to `frontend`
2. Build command is `npm run build`
3. Output directory is `dist`
4. All dependencies are listed in `frontend/package.json`

---

## Summary

| Service | URL | Environment Variables |
|---------|-----|----------------------|
| **Backend (Render)** | `https://your-service.onrender.com` | `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, `NODE_ENV`, `PORT` |
| **Frontend (Vercel)** | `https://mental-awareness-app.vercel.app` | `VITE_API_URL`, `VITE_CHAT_SERVER` |
| **Database (MongoDB Atlas)** | Atlas Dashboard | Connection String (used in `MONGODB_URI`) |

---

**Questions?** Check the logs on Render and Vercel dashboards, or refer to their documentation.
