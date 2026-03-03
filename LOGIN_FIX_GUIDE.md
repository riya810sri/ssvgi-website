# Login Issue Fix Guide

## ✅ Backend Test Passed!

I've verified that the backend is working correctly:
- ✅ Users exist in database
- ✅ Passwords are correct
- ✅ API login endpoint works
- ✅ Token generation successful

## 🔑 Correct Credentials

### Master User
- **Email:** `master@ssvgi.edu`
- **Password:** `admin123`  ← Use exactly this (lowercase, no spaces)
- **Login URL:** http://localhost:3000/admin/login

### Admin User
- **Email:** `admin@ssvgi.edu`
- **Password:** `admin123`
- **Login URL:** http://localhost:3000/admin/login

### Student User
- **Email:** `test@student.com`
- **Password:** `admin123`
- **Login URL:** http://localhost:3000/login

## 🔧 Fix Steps

### Step 1: Verify Backend is Running

```bash
cd server
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

### Step 2: Test Backend Directly

```bash
cd server
npm run test-login
```

You should see all tests passing with ✅

### Step 3: Clear Browser Data

**Option A: Quick Clear (Recommended)**
1. Open browser
2. Press `Ctrl + Shift + Delete` (Windows/Linux) or `Cmd + Shift + Delete` (Mac)
3. Select "All time"
4. Check: Cookies, Cache, Local Storage
5. Click "Clear data"

**Option B: Manual Clear**
1. Open DevTools (F12)
2. Go to Application tab
3. Clear Storage → "Clear site data"
4. Close and reopen browser

### Step 4: Restart Frontend

```bash
# Stop frontend (Ctrl+C)
# Start again
npm start
```

### Step 5: Try Login

1. Go to: http://localhost:3000/admin/login
2. Email: `master@ssvgi.edu`
3. Password: `admin123`
4. Click "Sign in"

## 🐛 Still Getting "Invalid Credentials"?

### Debug Method 1: Check Browser Console

1. Open DevTools (F12)
2. Go to Console tab
3. Try logging in
4. Look for errors

**Common errors:**

**Error: "Network request failed"**
→ Backend not running
→ Fix: `cd server && npm run dev`

**Error: "CORS error"**
→ See CORS_FIX.md
→ Fix: Restart backend server

**Error: "Failed to fetch"**
→ Wrong API URL
→ Fix: Check src/utils/api.js line 1

### Debug Method 2: Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Try logging in
4. Click on the "login" request
5. Check:
   - **Request URL:** Should be `http://localhost:5000/api/auth/login`
   - **Request Method:** Should be POST
   - **Request Payload:** Should show email and password
   - **Status:** Should be 200 (if credentials correct) or 401 (if wrong)
   - **Response:** Should show token and user data

### Debug Method 3: Test API Directly in Browser

Open this URL in browser:
```
http://localhost:5000/api/health
```

You should see:
```json
{"status":"ok","message":"SSVGI API is running"}
```

If you get "Cannot GET", backend is not running.

### Debug Method 4: Check Frontend API URL

Check file: `src/utils/api.js` line 1

Should be:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

### Debug Method 5: Manual API Test

Open browser console and paste:

```javascript
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'master@ssvgi.edu',
    password: 'admin123'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

**Expected output:**
```javascript
{
  success: true,
  token: "eyJhbGc...",
  admin: {
    id: "...",
    name: "Master Admin",
    email: "master@ssvgi.edu",
    role: "master"
  }
}
```

## 🔄 Complete Reset (Nuclear Option)

If nothing works, do a complete reset:

```bash
# 1. Stop all servers
# Press Ctrl+C in all terminals

# 2. Drop database
mongosh ssvgi --eval "db.dropDatabase()"

# 3. Recreate users
cd server
npm run setup-users

# 4. Start backend
npm run dev

# 5. Start frontend (new terminal)
cd ..
npm start

# 6. Clear browser completely
# Clear all browsing data, close browser, open again

# 7. Try login
# http://localhost:3000/admin/login
# master@ssvgi.edu / admin123
```

## ✅ Verification Checklist

Before trying to login, verify:

- [ ] MongoDB is running (`mongosh` command works)
- [ ] Backend server is running on port 5000
- [ ] Backend test passes (`npm run test-login` shows all ✅)
- [ ] Frontend is running on port 3000
- [ ] No CORS errors in browser console
- [ ] Browser cache is cleared
- [ ] Using correct credentials (case-sensitive!)
- [ ] No typos in email or password

## 📊 Expected Behavior

**Correct Login:**
1. Enter: `master@ssvgi.edu` / `admin123`
2. Click "Sign in"
3. Loading spinner appears
4. Redirects to `/master/dashboard`
5. See welcome message and statistics

**Wrong Password:**
1. Enter: `master@ssvgi.edu` / `wrongpassword`
2. Click "Sign in"
3. Red error message: "Invalid credentials"

## 🆘 Still Not Working?

Run diagnostics:

```bash
# Check all services
cd server

# Test 1: MongoDB
mongosh ssvgi --eval "db.admins.countDocuments()"
# Should show: 2

# Test 2: Backend
curl http://localhost:5000/api/health
# Should show: {"status":"ok"...}

# Test 3: Login API
npm run test-login
# Should show all ✅

# Test 4: Port usage
netstat -ano | grep 5000
netstat -ano | grep 3000
# Should show node processes
```

## 💡 Pro Tips

1. **Always test backend first** with `npm run test-login`
2. **Check browser console** for errors
3. **Use Network tab** to inspect requests
4. **Clear cache** between tests
5. **Restart servers** after code changes
6. **Password is case-sensitive** - use lowercase `admin123`

---

**Status:** Backend verified ✅
**Next Steps:**
1. Clear browser cache
2. Restart frontend
3. Try login with exact credentials above
