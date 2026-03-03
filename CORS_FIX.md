# CORS Error Fix Guide

## ✅ What I Fixed

### 1. Enhanced CORS Configuration
Updated `server/server.js` with more flexible CORS settings:
- Added multiple origins: `localhost:3000`, `localhost:3001`, `127.0.0.1:3000`
- Added PATCH and OPTIONS methods
- Added credentials support
- Added request logging for debugging

### 2. Steps to Fix CORS Error

#### Step 1: Restart Backend Server

```bash
# Stop the current server (Ctrl+C if running)

# Navigate to server directory
cd server

# Start the server
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

#### Step 2: Verify Server is Running

Open a new terminal and test:

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test courses endpoint
curl http://localhost:5000/api/courses
```

Expected response for health:
```json
{"status":"ok","message":"SSVGI API is running"}
```

Expected response for courses:
```json
{
  "success": true,
  "count": 0,
  "data": []
}
```

#### Step 3: Check MongoDB Connection

```bash
# Check if MongoDB is running
mongosh --eval "db.version()"

# OR for older MongoDB
mongo --eval "db.version()"
```

If MongoDB is not running, start it:

**On Ubuntu/Linux:**
```bash
sudo systemctl start mongod
sudo systemctl status mongod
```

**On macOS:**
```bash
brew services start mongodb-community
```

**On Windows:**
```bash
net start MongoDB
```

#### Step 4: Seed Some Test Courses

If you have no courses in the database, add some test data:

```bash
# In server directory
node -e "
const mongoose = require('mongoose');
const Course = require('./models/Course');

mongoose.connect('mongodb://localhost:27017/ssvgi')
  .then(async () => {
    await Course.create([
      {
        name: 'Computer Science',
        code: 'CS101',
        description: 'Introduction to Computer Science',
        duration: '4 years',
        department: 'Engineering',
        isActive: true
      },
      {
        name: 'Electronics Engineering',
        code: 'EE101',
        description: 'Electronics and Communication',
        duration: '4 years',
        department: 'Engineering',
        isActive: true
      }
    ]);
    console.log('✅ Test courses created');
    process.exit(0);
  });
"
```

#### Step 5: Restart Frontend

```bash
# Stop frontend (Ctrl+C if running)

# Start frontend
npm start
```

#### Step 6: Clear Browser Cache

1. Open browser DevTools (F12)
2. Right-click on refresh button → "Empty Cache and Hard Reload"
3. Or use: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

### 3. Debugging CORS Issues

#### Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Refresh the page
4. Look for the `/api/courses` request
5. Check:
   - **Status Code:** Should be 200
   - **Response Headers:** Should include `Access-Control-Allow-Origin`
   - **Response:** Should have data

#### Common Issues and Solutions

**Issue 1: ERR_CONNECTION_REFUSED**
```
Solution: Backend server is not running
→ Start backend: cd server && npm run dev
```

**Issue 2: 404 Not Found**
```
Solution: Wrong API URL
→ Check: src/utils/api.js has correct base URL
→ Should be: http://localhost:5000/api
```

**Issue 3: MongoDB Connection Error**
```
Solution: MongoDB is not running
→ Start MongoDB (see Step 3 above)
```

**Issue 4: Empty Courses Array**
```
Solution: No courses in database
→ Add test courses (see Step 4 above)
```

**Issue 5: CORS Error Still Persists**
```
Solution: Check if multiple servers are running
→ Kill all node processes: pkill node (Linux/Mac)
→ Or: taskkill /F /IM node.exe (Windows)
→ Restart backend and frontend
```

### 4. Verify Fix is Working

Test the API directly in browser:

**Option 1: Browser**
```
http://localhost:5000/api/courses
```

**Option 2: curl**
```bash
curl -v http://localhost:5000/api/courses
```

Look for these headers in response:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
```

### 5. Environment Variables Check

Verify `server/.env` has:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ssvgi
JWT_SECRET=your-secret-key
```

Verify frontend is using correct API URL:
```javascript
// In src/utils/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

### 6. Quick Test Script

Create `server/test-api.js`:

```javascript
const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing API...');

    const health = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Health check:', health.data);

    const courses = await axios.get('http://localhost:5000/api/courses');
    console.log('✅ Courses:', courses.data);

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testAPI();
```

Run it:
```bash
cd server
npm install axios  # if not already installed
node test-api.js
```

### 7. Final Checklist

- [ ] MongoDB is running
- [ ] Backend server is running on port 5000
- [ ] Frontend is running on port 3000
- [ ] No CORS errors in browser console
- [ ] `/api/courses` returns data (even if empty array)
- [ ] Browser cache cleared

## 🎯 Expected Result

After following these steps, you should see:

**Backend Console:**
```
✅ Connected to MongoDB
🚀 Server running on port 5000
2025-11-06T... - GET /api/courses
```

**Frontend:**
Courses load successfully without CORS error

**Browser Network Tab:**
```
Status: 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: http://localhost:3000
```

## 🆘 Still Having Issues?

If CORS errors persist after all steps:

1. **Check firewall:** Ensure ports 3000 and 5000 are not blocked
2. **Check antivirus:** Some antivirus software blocks CORS
3. **Try different browser:** Test in Chrome/Firefox
4. **Check proxy:** VPN or proxy might interfere
5. **Use developer tools:** Check exact error message

Run this diagnostic:
```bash
# Check if ports are in use
netstat -ano | grep 5000
netstat -ano | grep 3000

# Check backend logs
cd server
npm run dev  # Watch for any errors
```

---

**Fixed:** CORS configuration updated ✅
**Status:** Ready to test 🚀
