# Quick Deployment Reference

## 🎯 Quick Links

| Service | URL |
|---------|-----|
| **GitHub Repo** | https://github.com/yourusername/mental-awareness-app |
| **Render Dashboard** | https://dashboard.render.com |
| **Vercel Dashboard** | https://vercel.com/dashboard |
| **MongoDB Atlas** | https://cloud.mongodb.com |
| **Your Backend** | https://your-service-name.onrender.com |
| **Your Frontend** | https://your-app.vercel.app |

---

## 📋 Copy-Paste Templates

### Backend (.env for Render)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
JWT_SECRET=generate-with-openssl-rand-hex-32
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://mental-awareness-app.vercel.app
```

### Frontend (.env for Vercel)
```env
VITE_API_URL=https://your-service-name.onrender.com
VITE_CHAT_SERVER=https://your-service-name.onrender.com
```

---

## 📱 Step-by-Step Deployment

### Step 1: GitHub Setup (5 min)
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: MongoDB (5 min)
1. Create account at mongodb.com/cloud/atlas
2. Create cluster
3. Create database user
4. Get connection string
5. Whitelist IP (0.0.0.0/0 for testing, or specific Render IP for production)

### Step 3: Render Backend (10 min)
1. Go to render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repo
4. Set Root Directory to `backend`
5. Add 6 environment variables (see table below)
6. Deploy

### Step 4: Vercel Frontend (5 min)
1. Go to vercel.com
2. Click "New Project"
3. Select your repo
4. Set Root Directory to `frontend`
5. Add 2 environment variables (see table below)
6. Deploy

### Step 5: Test (5 min)
- [ ] Backend responds: `curl https://your-backend.onrender.com`
- [ ] Frontend loads: open in browser
- [ ] Socket connects: check DevTools console
- [ ] Chat works: test with 2 accounts

---

## 🔧 Render Environment Variables

Copy-paste this table into Render dashboard:

| Variable | Value |
|----------|-------|
| `PORT` | `5000` |
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster...` |
| `JWT_SECRET` | `<generate-random-32-chars>` |
| `JWT_EXPIRES_IN` | `7d` |
| `FRONTEND_URL` | `https://mental-awareness-app.vercel.app` |

---

## 🎨 Vercel Environment Variables

Copy-paste this table into Vercel dashboard:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://your-service-name.onrender.com` |
| `VITE_CHAT_SERVER` | `https://your-service-name.onrender.com` |

---

## 🚀 Deployment Settings

### Render
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Node Version:** 18 (default)
- **Plan:** Free (Starter tier)

### Vercel
- **Root Directory:** `frontend`
- **Framework:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Node Version:** 18 (default)
- **Plan:** Free (Hobby tier)

### MongoDB Atlas
- **Cluster Tier:** M0 (free)
- **Region:** Same as Render region for best performance
- **IP Whitelist:** `0.0.0.0/0` (or Render static IP)

---

## ⚡ Troubleshooting Quick Fixes

| Issue | Fix |
|-------|-----|
| CORS error | Update `FRONTEND_URL` in Render, redeploy |
| Socket won't connect | Check `VITE_API_URL` matches Render URL |
| MongoDB error | Whitelist IP in MongoDB Atlas |
| Build fails | Check logs on Vercel or Render |
| JWT error | Regenerate `JWT_SECRET` |
| Blank page | Check network tab, look for 404s |

---

## 📊 Service Status URLs

After deployment, check:

```bash
# Backend status
curl -I https://your-service.onrender.com

# Frontend status
curl -I https://your-app.vercel.app

# Logs
# Render: render.com → your service → Logs
# Vercel: vercel.com → your project → Deployments → Logs
```

---

## 🔐 Security Reminders

- ❌ Never commit `.env` files
- ❌ Never share env var values
- ✅ Use strong JWT secrets (32+ random characters)
- ✅ Always use `https://` in production
- ✅ Update IP whitelist when moving services
- ✅ Monitor logs for errors
- ✅ Change passwords regularly

---

## 📞 Support

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Docs:** https://docs.mongodb.com
- **Socket.IO Docs:** https://socket.io/docs

---

**Total time to deploy: ~30 minutes (including MongoDB setup)**

Good luck! 🚀
