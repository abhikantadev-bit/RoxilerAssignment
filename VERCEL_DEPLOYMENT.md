# 🚀 Vercel Deployment Guide

## Problem: 404 Error on Vercel

**Cause**: Missing configuration and API endpoint mismatch

---

## Fix Steps

### Step 1: Deploy Backend First

Your React app needs an API to call. You have three options:

#### Option A: Deploy to Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Create new project → Deploy from GitHub repo
4. Select your RoxilerAssignment repo
5. Add these variables in Railway dashboard:
   ```
   NODE_ENV=production
   JWT_SECRET=<generate-secure-key>
   DATABASE_PATH=/data/roxiler.db
   PORT=5000
   ```
6. Railway will give you a URL like: `https://roxilerassignment-prod.up.railway.app`

#### Option B: Deploy to Render
1. Go to [render.com](https://render.com)
2. New → Web Service → Connect GitHub repo
3. Set Start Command: `cd backend && npm start`
4. Add environment variables (same as above)
5. Get your backend URL: `https://roxiler-api.onrender.com`

#### Option C: Deploy to Heroku
1. Go to [heroku.com](https://heroku.com)
2. Create new app
3. Connect GitHub repository
4. Add buildpack: `heroku/nodejs`
5. Set environment variables
6. Deploy

---

### Step 2: Update Frontend Environment Variables in Vercel

1. **Go to Vercel Dashboard**
   - Select your RoxilerAssignment project
   - Settings → Environment Variables

2. **Add this variable**:
   ```
   REACT_APP_API_BASE_URL=https://your-backend-url.up.railway.app/api
   ```
   Replace `your-backend-url` with your actual backend URL from Railway/Render/Heroku

3. **Click "Add" and redeploy**

---

### Step 3: Verify vercel.json

Check [frontend/vercel.json](vercel.json) is present with proper SPA routing:

```json
{
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html",
      "status": 200
    }
  ]
}
```

This ensures all routes fall back to index.html for React Router.

---

### Step 4: Redeploy Frontend

1. **Push changes to GitHub**:
   ```bash
   git add .
   git commit -m "Add Vercel configuration"
   git push
   ```

2. **Trigger redeploy** in Vercel dashboard
   - Go to Deployments
   - Click "Redeploy"

---

## Environment Variable Setup Example

### In Vercel (Frontend)
```
REACT_APP_API_BASE_URL=https://roxiler-api.up.railway.app/api
```

### In Railway/Render (Backend)
```
NODE_ENV=production
JWT_SECRET=aB3$cD9&eF1!gH5%iJ7^kL2@mN4#oP6*qR8(sT0)uV1-wX2=yZ3+
JWT_EXPIRE=7d
DATABASE_PATH=/data/roxiler.db
PORT=5000
```

---

## Common Issues & Fixes

### Issue: Still Getting 404
**Fix**: 
- Verify `vercel.json` exists in frontend directory
- Check backend URL is correct in REACT_APP_API_BASE_URL
- Wait 5 minutes for Vercel to redeploy
- Clear browser cache (Ctrl+Shift+Del)

### Issue: API calls failing with CORS error
**Fix**: 
- Check backend has CORS enabled: `app.use(cors());`
- Verify API URL doesn't have trailing slash
- Backend must be deployed and running

### Issue: "REACT_APP_API_BASE_URL not found"
**Fix**:
- Redeploy after adding env variable to Vercel
- Variables take effect on new deployments, not existing ones

### Issue: Database file not found on Railway
**Fix**:
- Railway has persistent /data directory
- Change `DATABASE_PATH` to `/data/roxiler.db`
- Create database on first run (use initDatabase.js)

---

## Testing After Deployment

### 1. Check Frontend Works
```
https://your-vercel-app.vercel.app/
```
Should load login page without 404

### 2. Test API Connection
Open browser console (F12) and run:
```javascript
fetch('https://your-backend-url.up.railway.app/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@test.com', password: 'Test@1234' })
}).then(r => r.json()).then(d => console.log(d))
```

Should return error about invalid credentials (not CORS error or 404)

### 3. Test Full Flow
1. Go to signup page
2. Create account
3. Login
4. Should see dashboard

---

## Quick Deployment Checklist

**Backend**:
- [ ] Code pushed to GitHub
- [ ] Deployed to Railway/Render/Heroku
- [ ] Environment variables set
- [ ] Database initialized
- [ ] Backend URL noted (e.g., https://xxx.up.railway.app)

**Frontend**:
- [ ] vercel.json exists in frontend/
- [ ] Environment variable set in Vercel: `REACT_APP_API_BASE_URL`
- [ ] Redeployed after env change
- [ ] Testing API connection works

---

## Production Security Checklist

- [ ] Change JWT_SECRET to secure random value:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- [ ] Set NODE_ENV=production
- [ ] Use HTTPS (automatic on Vercel/Railway)
- [ ] Database path on persistent storage (/data)
- [ ] CORS configured for your domain only (optional):
  ```javascript
  app.use(cors({
    origin: 'https://your-vercel-app.vercel.app'
  }));
  ```

---

## File References

- **Vercel Config**: [frontend/vercel.json](vercel.json)
- **API Client**: [frontend/src/services/apiClient.js](../frontend/src/services/apiClient.js#L3)
- **Backend Entry**: [backend/server.js](../backend/server.js)
- **Backend Routes**: [backend/src/routes](../backend/src/routes/)

---

**Status**: Ready to deploy  
**Last Updated**: January 17, 2026
