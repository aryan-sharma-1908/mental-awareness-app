# GitHub, Vercel, and Render Deployment Checklist

Complete checklist for deploying your Mental Awareness App to production.

---

## ✅ Code Changes Made

### 1. Backend Configuration
- ✅ Updated `backend/app.js` CORS whitelist to use `process.env.FRONTEND_URL`
- ✅ Created `backend/.env.example` template file
- ✅ Verified database connection uses `process.env.MONGODB_URI`
- ✅ Verified app starts HTTP server correctly for Socket.IO

### 2. Frontend Configuration
- ✅ Verified `frontend/src/config.js` uses `VITE_API_URL` environment variable
- ✅ Created `frontend/.env.example` template file
- ✅ Verified `package.json` has correct build scripts

### 3. Git Setup
- ✅ Root `.gitignore` already exists with proper exclusions
- ✅ Created `.env.example` files in both backend and frontend
- ✅ `.env` files are properly excluded from git

### 4. Documentation
- ✅ Created comprehensive `DEPLOYMENT.md`
- ✅ Updated root `README.md`
- ✅ Created this deployment checklist

---

## 📋 Pre-Deployment Steps

### 1. Clean Up Local Files
```bash
# Remove .env files (they're in .gitignore)
rm backend/.env
rm frontend/.env

# Verify they're not tracked
git status  # Should NOT show .env files
```

### 2. Update .env Files Before Pushing
**DO NOT commit these files!** They should only exist locally.

```bash
# Create local .env files for testing
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit with real values (keep these local only)
# backend/.env and frontend/.env will be in .gitignore
```

### 3. Test Locally
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev

# Open http://localhost:5173 and test all features
```

### 4. Push to GitHub
```bash
git add .
git commit -m "Prepare for deployment: add env examples and DEPLOYMENT guide"
git push origin main
```

---

## 🔧 Render Setup (Backend)

### Environment Variables to Add in Render Dashboard

| Key | Value | Example |
|-----|-------|---------|
| `PORT` | `5000` | `5000` |
| `MONGODB_URI` | Your MongoDB Atlas URI | `mongodb+srv://user:pass@cluster.mongodb.net/db?retryWrites=true&w=majority` |
| `JWT_SECRET` | Strong random secret | `9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c` |
| `JWT_EXPIRES_IN` | `7d` | `7d` |
| `NODE_ENV` | `production` | `production` |
| `FRONTEND_URL` | Your Vercel URL | `https://mental-awareness-app.vercel.app` |

### Deployment Steps on Render

1. Go to https://render.com
2. Click **New +** → **Web Service**
3. Connect GitHub repository
4. Fill form:
   - **Name:** `mental-awareness-app-backend`
   - **Environment:** Node
   - **Region:** Choose closest to users
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Root Directory:** `backend`
5. Add all environment variables (see table above)
6. Click **Create Web Service**
7. Wait for build to complete
8. Copy the service URL (e.g., `https://mental-awareness-app-backend.onrender.com`)

---

## 🚀 Vercel Setup (Frontend)

### Environment Variables to Add in Vercel Dashboard

| Key | Value | Example |
|-----|-------|---------|
| `VITE_API_URL` | Your Render backend URL | `https://mental-awareness-app-backend.onrender.com` |
| `VITE_CHAT_SERVER` | Your Render backend URL (same) | `https://mental-awareness-app-backend.onrender.com` |

### Deployment Steps on Vercel

1. Go to https://vercel.com
2. Click **New Project**
3. Select your GitHub repository
4. Fill form:
   - **Project Name:** `mental-awareness-app-frontend`
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add environment variables:
   - `VITE_API_URL` → Your Render backend URL
   - `VITE_CHAT_SERVER` → Your Render backend URL
6. Click **Deploy**
7. Wait for build to complete
8. Your frontend URL will be: `https://mental-awareness-app.vercel.app`

---

## 🔐 MongoDB Setup (Atlas)

### Prerequisites
- MongoDB Atlas account (free at https://www.mongodb.com/cloud/atlas)
- Cluster created

### IP Whitelist Configuration

1. Go to MongoDB Atlas Dashboard
2. Click **Network Access** (or **IP Whitelist**)
3. Click **Add IP Address**
4. Options:
   - **For Production (Recommended):** Add Render IP (check Render deployment settings)
   - **For Testing:** Allow all IPs `0.0.0.0/0` (⚠️ less secure, use only for testing)
5. Click **Confirm**

### Get Connection String

1. Click **Databases**
2. Click **Connect** on your cluster
3. Choose **Drivers** → **Node.js**
4. Copy connection string
5. Replace `<username>`, `<password>`, and `<dbname>` with your actual credentials
6. Use as `MONGODB_URI` in Render

**Example:**
```
mongodb+srv://aryansharma81828_db_user:h475Npop6MmBeka2@mental-awareness-app.smkk6on.mongodb.net/?retryWrites=true&w=majority&appName=mental-awareness-app
```

---

## 📱 Post-Deployment Testing

### 1. Test Backend Connectivity
```bash
curl https://your-render-service.onrender.com
# Should return: "Server is running"
```

### 2. Test Frontend Load
- Open https://your-vercel-app.vercel.app
- Should load without errors
- Check DevTools Console for CORS errors

### 3. Test Socket.IO Connection
1. Open frontend in browser
2. Open DevTools → Console
3. Should see no auth/connect errors
4. Check Network tab for WebSocket connection to backend

### 4. Test Chat Feature (2 Browser Sessions)
1. Open App in Browser A (normal window)
2. Open App in Browser B (Incognito window)
3. Sign up and log in as 2 different users
4. From Account A → Community → Message another user
5. From Account B → Keep chat closed
6. Send message from Account A
7. **Expected in Account B:**
   - Popup notification with sender name
   - Red badge on chat button
   - Unread count increases
8. Click chat in Account B
   - Message should appear
   - Unread should clear
   - Both sides should see messages

### 5. Monitor Production Logs

**Render:**
- Go to your Web Service → Logs
- Should see: "Server running on port 5000"
- Should see: "MongoDB connected successfully"
- Look for any error messages

**Vercel:**
- Go to your Project → Deployments
- Click latest deployment → Logs
- Should see build completed successfully
- Check for any build errors

---

## 🚨 Common Issues & Solutions

### Issue: CORS Error in Browser Console
```
Access to XMLHttpRequest ... has been blocked by CORS policy
```

**Solution:**
1. Check `FRONTEND_URL` is set in Render env vars
2. Verify it matches your Vercel production URL
3. Check `backend/app.js` CORS whitelist includes the URL
4. Redeploy Render after changing env vars

### Issue: Socket.IO Won't Connect
```
WebSocket is closed before the connection is established
```

**Solution:**
1. Verify Socket.IO server running (test backend URL)
2. Check `VITE_API_URL` matches backend URL
3. Check `VITE_CHAT_SERVER` matches backend URL
4. Look in Render logs for Socket.IO errors

### Issue: MongoDB Connection Error
```
MongoServerSelectionError: getaddrinfo ENOTFOUND
```

**Solution:**
1. Verify `MONGODB_URI` is correct
2. Check IP whitelist in MongoDB Atlas includes Render IP
3. Try allowing all IPs (`0.0.0.0/0`) for testing
4. Test locally with same URI

### Issue: Build Fails on Vercel
```
Build failed
```

**Solution:**
1. Check Vercel logs for specific error
2. Verify Root Directory is `frontend`
3. Verify all dependencies in `frontend/package.json`
4. Try building locally: `cd frontend && npm run build`
5. Check for TypeScript errors

### Issue: Messages Not Sending
```
send_message failed
```

**Solution:**
1. Check socket is connected (look in logs)
2. Verify JWT token is present in localStorage
3. Check backend JWT_SECRET is correct
4. Look in Render logs for "send_message" errors

---

## 📚 Reference URLs

| Service | URL |
|---------|-----|
| GitHub | https://github.com/yourusername/mental-awareness-app |
| Render Dashboard | https://dashboard.render.com |
| Vercel Dashboard | https://vercel.com/dashboard |
| MongoDB Atlas | https://cloud.mongodb.com |
| Your Backend | `https://your-service-name.onrender.com` |
| Your Frontend | `https://mental-awareness-app.vercel.app` |

---

## ✨ Final Checklist

Before deploying:
- [ ] `.env` files are NOT in git (check `.gitignore`)
- [ ] `.env.example` files ARE in git with placeholders
- [ ] `DEPLOYMENT.md` has been created
- [ ] `README.md` has been updated
- [ ] Backend `app.js` uses `process.env.FRONTEND_URL`
- [ ] Frontend `config.js` uses `VITE_API_URL`
- [ ] All tests pass locally
- [ ] Code is pushed to GitHub

On Render:
- [ ] All 6 environment variables are set
- [ ] Build command is `npm install`
- [ ] Start command is `npm start`
- [ ] Root directory is `backend`
- [ ] Deployment succeeded

On Vercel:
- [ ] Both environment variables are set
- [ ] Root directory is `frontend`
- [ ] Build command is `npm run build`
- [ ] Output directory is `dist`
- [ ] Deployment succeeded

In MongoDB Atlas:
- [ ] Render IP is whitelisted (or 0.0.0.0/0 for testing)
- [ ] Connection string is valid
- [ ] Database exists

Final:
- [ ] Backend API responds to GET /
- [ ] Frontend loads without errors
- [ ] Socket.IO connects in browser console
- [ ] Chat feature works (test with 2 browsers)
- [ ] Logs show no critical errors

---

**Congratulations! Your app is ready for production! 🎉**

For questions, refer to `DEPLOYMENT.md` or check the service dashboards.
