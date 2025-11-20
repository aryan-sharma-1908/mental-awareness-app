# Environment Variables Reference

Quick reference for all environment variables needed for deployment.

---

## 🔙 Backend (Render)

### Required Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-strong-random-secret-here
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### How to Generate JWT_SECRET

```bash
# On macOS/Linux
openssl rand -hex 32

# On Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Max 256) }))

# Or use an online generator
# https://www.uuidgenerator.net/
```

### MongoDB Connection String Format

```
mongodb+srv://username:password@cluster-name.mongodb.net/database-name?retryWrites=true&w=majority
```

**Where to find:**
1. MongoDB Atlas → Clusters → Connect
2. Choose "Drivers" → "Node.js"
3. Copy the connection string
4. Replace `<username>`, `<password>`, `<dbname>`

---

## 🎨 Frontend (Vercel)

### Required Variables

```env
# API Endpoints (same URL for both)
VITE_API_URL=https://your-backend-service.onrender.com
VITE_CHAT_SERVER=https://your-backend-service.onrender.com
```

### Important Notes

- Both `VITE_API_URL` and `VITE_CHAT_SERVER` should point to the **same** Render backend URL
- Must use `https://` (not `http://`)
- Must NOT have trailing slash
- Socket.IO uses WebSocket on the same URL

---

## 📦 MongoDB Atlas

### Setup Steps

1. Create MongoDB Atlas account: https://www.mongodb.com/cloud/atlas
2. Create a cluster (free tier available)
3. Create a database user with strong password
4. Get connection string from Connect button
5. Whitelist Render IP or use `0.0.0.0/0` for testing

### Connection String

```
mongodb+srv://db_user:password@cluster.smkk6on.mongodb.net/?retryWrites=true&w=majority&appName=mental-awareness-app
```

---

## 🚀 Deployment Mapping

### Render Dashboard Entry

| Field | Value |
|-------|-------|
| `PORT` | `5000` |
| `MONGODB_URI` | Copy from MongoDB Atlas |
| `JWT_SECRET` | Generate a random string (see above) |
| `JWT_EXPIRES_IN` | `7d` |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | Your Vercel URL (e.g., `https://mental-awareness-app.vercel.app`) |

### Vercel Dashboard Entry

| Field | Value |
|-------|-------|
| `VITE_API_URL` | Your Render URL (e.g., `https://mental-awareness-app-backend.onrender.com`) |
| `VITE_CHAT_SERVER` | Same as above |

---

## 🔒 Security Best Practices

1. **Never commit `.env` files**
   - Use `.env.example` as template
   - Add `.env` to `.gitignore`

2. **Use strong JWT secrets**
   - Generate with `openssl rand -hex 32`
   - Never use plain text like "secret123"
   - Update secret every 6 months

3. **Rotate passwords**
   - Change MongoDB password if compromised
   - Don't share env vars in emails/chat

4. **IP Whitelist MongoDB**
   - Use specific Render IP if available
   - Only use `0.0.0.0/0` for testing
   - Never for production

5. **HTTPS Only**
   - Both Render and Vercel provide free SSL
   - Never use `http://` in production
   - Set `NODE_ENV=production`

6. **Monitor Logs**
   - Check Render logs regularly
   - Set up alerts for errors
   - Look for unauthorized access attempts

---

## 🔗 URLs After Deployment

Once deployed, your URLs will be:

```
Backend API:   https://your-service-name.onrender.com
Frontend UI:   https://your-app.vercel.app
Socket Server: wss://your-service-name.onrender.com (WebSocket)
```

Update frontend `.env` with backend URL before deploying.

---

## ⚠️ Common Mistakes

| ❌ Mistake | ✅ Fix |
|-----------|--------|
| Committing `.env` file | Add to `.gitignore`, use `.env.example` |
| Using `http://` in production | Change to `https://` |
| Trailing slash in URLs | Remove: `example.com/` → `example.com` |
| Wrong MongoDB IP | Whitelist Render IP or allow all |
| Empty `VITE_API_URL` | Must be set to backend URL |
| Hardcoded localhost URLs | Use environment variables |
| Not setting `NODE_ENV=production` | Backend won't optimize properly |
| Same secret across environments | Use different secrets per environment |

---

## 📋 Verification Checklist

After deploying, verify:

```bash
# 1. Backend is running
curl https://your-service-name.onrender.com
# Should return: "Server is running"

# 2. Check logs for errors
# Render Dashboard → Logs → should see "MongoDB connected" and "Socket.IO listening"

# 3. Frontend loads
# Open https://your-app.vercel.app
# Should load without 404 errors

# 4. Socket.IO connects
# Open DevTools → Console
# Should NOT see "Auth error" or "connect_error"

# 5. Test chat feature
# Login with 2 accounts → Send message
# Receiver should see popup with unread badge
```

---

## 🆘 Need Help?

If env vars are incorrect, you'll see:

| Error | Likely Cause |
|-------|--------------|
| `MongoServerSelectionError` | Bad `MONGODB_URI` or IP not whitelisted |
| `CORS: Not allowed by CORS` | Bad `FRONTEND_URL` in backend |
| `Auth error` in socket logs | Missing or wrong `JWT_SECRET` |
| `Cannot GET /` on Render | Backend not starting (check logs) |
| Socket won't connect | Wrong `VITE_API_URL` or `VITE_CHAT_SERVER` |

---

## 📚 References

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.mongodb.com/atlas/)
- [Socket.IO Production Deployment](https://socket.io/docs/v4/socket-io-on-production/)
- [Express.js Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

---

**All set! Your environment variables are configured correctly. 🎉**
