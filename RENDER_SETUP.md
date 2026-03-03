# 🚀 Render Backend Setup Guide

## Problem
Backend on Render is returning `401 Unauthorized` because it's not connected to the correct MongoDB database.

## Solution: Update Render Environment Variables

### Step 1: Go to Render Dashboard

1. Visit: https://dashboard.render.com
2. Select your backend service (e.g., `ssvgi-backend` or `ssvgi-website`)

### Step 2: Add Environment Variables

Click **Environment** tab → **Add Environment Variable**:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://riya262:20012005@zerodhaclonecluster.rkngpv3.mongodb.net/ssvgi?retryWrites=true&w=majority` |
| `JWT_SECRET` | `ssvgi_super_secret_jwt_key_change_this_in_production_2025` |
| `JWT_EXPIRE` | `7d` |
| `PORT` | `5000` |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://ssvgi-website.onrender.com` |
| `ADMIN_EMAIL` | `admin@ssvgi.edu` |
| `ADMIN_PASSWORD` | `admin123` |

### Step 3: Redeploy

1. Click **Deploy** → **Manual Deploy** → **Deploy Latest Commit**
2. Wait for deployment to complete (~2-5 minutes)
3. Check **Logs** tab for any errors

### Step 4: Verify Deployment

Test these URLs in your browser:

1. **Health Check**: https://ssvgi-website.onrender.com/api/health
   - Should return: `{"status":"ok","message":"SSVGI API is running"}`

2. **Debug Check**: https://ssvgi-website.onrender.com/api/debug
   - Should show: `mongodbUri: "Set"`

3. **Test Login**: Try logging in at `http://localhost:3000/admin/login`
   - Email: `admin@ssvgi.edu`
   - Password: `admin123`

## Troubleshooting

### Still Getting 401?

1. **Check Render Logs:**
   - Go to Render Dashboard → Your service → **Logs**
   - Look for errors during deployment
   - Try logging in and check for error messages

2. **Verify MongoDB Connection:**
   - Visit: `https://ssvgi-website.onrender.com/api/debug`
   - Make sure `mongodbUri` shows "Set"

3. **Re-run Seed Script:**
   If the database is empty, you need to run the seed script again.
   
   **Option A: Run Locally** (Recommended)
   ```bash
   cd server
   npm install
   npm run seed
   ```

   **Option B: Use Render Shell** (Advanced)
   - Go to Render Dashboard → Your service
   - Click **Shell** tab
   - Run: `npm run seed`

### MongoDB Atlas Network Access

If Render can't connect to MongoDB:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **Network Access**
3. Click **Add IP Address**
4. Click **Allow Access from Anywhere** (or add Render's IP)
5. Click **Confirm**

### Check Admin Exists

Run locally to verify:
```bash
cd server
npm run seed
```

Should output: `Admin already exists!`

## Login Credentials

After successful setup:

- **URL**: http://localhost:3000/admin/login
- **Email**: admin@ssvgi.edu
- **Password**: admin123

## Security Note

⚠️ **Change the default password after first login!**

Also consider:
1. Removing the `/api/debug` endpoint in production
2. Using environment-specific CORS settings
3. Rotating the JWT_SECRET
