# SSVGI Admin Dashboard - Setup Guide

Complete guide to set up and use the SSVGI Admin Dashboard.

## Overview

The admin dashboard provides a comprehensive interface to manage:
- Student admission applications
- Alumni registrations
- Contact inquiries
- Course information
- Faculty details
- Awards and achievements

## Architecture

### Frontend
- **Framework:** React 18.2.0
- **Routing:** React Router v7
- **Styling:** Tailwind CSS
- **State Management:** Context API (AuthContext)
- **API Communication:** Fetch API with custom utility functions

### Backend
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcrypt for password hashing

## Complete Setup Instructions

### Step 1: Install Dependencies

#### Backend Dependencies
```bash
cd server
npm install
```

#### Frontend Dependencies
```bash
cd ..  # Back to root directory
npm install
```

### Step 2: Setup MongoDB

#### Option A: Local MongoDB
1. Install MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   - **Mac:** `brew services start mongodb-community`
   - **Linux:** `sudo systemctl start mongod`
   - **Windows:** MongoDB should start automatically as a service

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string
4. Update the MONGODB_URI in server/.env with your Atlas connection string

### Step 3: Configure Environment Variables

#### Backend (.env in server/)
```bash
cd server
cp .env.example .env
```

Edit server/.env:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ssvgi
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@ssvgi.edu
ADMIN_PASSWORD=admin123
```

**Important:** Change JWT_SECRET to a strong random string in production!

#### Frontend (.env in root directory)
Already configured with:
```
GENERATE_SOURCEMAP=false
REACT_APP_API_URL=http://localhost:5000/api
```

For production, update REACT_APP_API_URL to your backend URL.

### Step 4: Initialize Database with Admin User

```bash
cd server
npm run seed
```

You should see output like:
```
✅ Admin created successfully!
----------------------------
Email: admin@ssvgi.edu
Password: admin123
Role: superadmin
----------------------------
⚠️  Please change the password after first login!
```

### Step 5: Start the Application

You need to run both the backend and frontend servers.

#### Terminal 1 - Backend Server
```bash
cd server
npm run dev
```

You should see:
```
🚀 Server running on port 5000
✅ Connected to MongoDB
```

#### Terminal 2 - Frontend Server
```bash
cd ..  # Back to root directory
npm start
```

The React app should open automatically at http://localhost:3000

## Accessing the Admin Dashboard

### Step 1: Navigate to Admin Login
Go to: http://localhost:3000/admin/login

### Step 2: Login with Default Credentials
- **Email:** admin@ssvgi.edu
- **Password:** admin123

### Step 3: Explore the Dashboard
After successful login, you'll be redirected to `/admin/dashboard` where you can:

1. **Dashboard** - View statistics and overview
2. **Admissions** - Manage student applications
3. **Alumni** - View and manage alumni registrations
4. **Contacts** - Read and respond to contact messages
5. **Courses** - Create, edit, and delete courses
6. **Faculty** - Manage faculty information (placeholder)
7. **Awards** - Manage awards and achievements (placeholder)

## Admin Dashboard Features

### 1. Admissions Management
- View all applications with filtering by status
- Search by name, email, or phone
- Update application status (pending, reviewed, approved, rejected)
- View submission dates and applicant details

### 2. Alumni Management
- Browse all alumni registrations
- Search by name, company, or email
- View graduation year, degree, and current employment
- Track alumni status (pending, verified, active)

### 3. Contact Messages
- View all contact form submissions
- Filter by status (new, read, replied, closed)
- Reply to inquiries (interface included)
- Track message timestamps

### 4. Courses Management
- Create new courses with full details
- Edit existing course information
- Delete courses
- Manage course fees, duration, and eligibility

### 5. Dashboard Overview
- Real-time statistics
- Pending applications count
- New messages count
- Quick action buttons
- Recent activity feed

## Testing the Full Workflow

### Test Admission Submission
1. Go to http://localhost:3000/apply
2. Fill out the admission form
3. Submit the application
4. Login to admin dashboard
5. Check Admissions section - your application should appear
6. Update the status to see changes

### Test Alumni Registration
1. Go to http://localhost:3000/alumni
2. Fill out the alumni registration form
3. Submit the registration
4. Login to admin dashboard
5. Check Alumni section - your registration should appear

### Test Contact Form
1. Go to http://localhost:3000/ (scroll to contact section)
2. Fill out and submit the contact form
3. Login to admin dashboard
4. Check Contacts section - your message should appear

## Security Best Practices

### For Development
- Default credentials are fine for local testing
- MongoDB can run without authentication locally

### For Production
1. **Change Admin Password:**
   - Login to dashboard
   - Go to profile/settings
   - Update password immediately

2. **Secure Environment Variables:**
   - Generate a strong JWT_SECRET: `openssl rand -base64 32`
   - Use environment variables, never hardcode secrets
   - Don't commit .env files to version control

3. **Database Security:**
   - Enable MongoDB authentication
   - Use strong database passwords
   - Whitelist specific IP addresses

4. **API Security:**
   - Use HTTPS in production
   - Implement rate limiting
   - Add CORS restrictions
   - Validate all inputs

5. **JWT Tokens:**
   - Set appropriate expiration times
   - Implement refresh tokens for production
   - Store tokens securely (httpOnly cookies recommended)

## API Testing with Postman/Thunder Client

### Login Example
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@ssvgi.edu",
  "password": "admin123"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "...",
    "name": "Admin",
    "email": "admin@ssvgi.edu",
    "role": "superadmin"
  }
}
```

### Get Admissions Example
```
GET http://localhost:5000/api/admissions
Authorization: Bearer <your_token_here>
```

## Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution:**
- Verify MongoDB is running: `mongosh` (should connect)
- Check MONGODB_URI in server/.env
- Try restarting MongoDB service

### Issue: "Invalid credentials" when logging in
**Solution:**
- Make sure you ran `npm run seed` in the server directory
- Verify admin email/password in server/.env
- Try creating admin again: `npm run seed`

### Issue: "Network Error" or CORS issues
**Solution:**
- Make sure backend is running on port 5000
- Check REACT_APP_API_URL in frontend .env
- Verify CORS is enabled in server/server.js

### Issue: "Token expired" or authentication errors
**Solution:**
- Logout and login again
- Clear localStorage: `localStorage.clear()` in browser console
- Check JWT_SECRET is set in server/.env

### Issue: Forms submit but data doesn't appear in admin
**Solution:**
- Check browser console for errors
- Verify API endpoints in src/utils/api.js
- Check backend logs for errors
- Ensure MongoDB is running and connected

## Project File Structure

```
ssvgi-website/
├── public/                    # Static files
├── src/
│   ├── components/           # Reusable components
│   │   ├── admin/           # Admin-specific components
│   │   │   └── AdminLayout.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── ...
│   ├── context/             # React context
│   │   └── AuthContext.jsx  # Authentication state
│   ├── pages/               # Page components
│   │   ├── admin/          # Admin pages
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Admissions.jsx
│   │   │   ├── Alumni.jsx
│   │   │   ├── Contacts.jsx
│   │   │   └── Courses.jsx
│   │   └── ...             # Public pages
│   ├── utils/              # Utility functions
│   │   └── api.js          # API calls
│   ├── App.js              # Main app with routing
│   └── index.js            # Entry point
├── server/                  # Backend API
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── scripts/           # Utility scripts
│   ├── .env.example       # Environment template
│   └── server.js          # Backend entry point
├── .env                    # Frontend environment
├── package.json           # Frontend dependencies
└── README.md             # This file
```

## Admin Routes Reference

- `/admin/login` - Admin login page
- `/admin/dashboard` - Main dashboard
- `/admin/admissions` - Manage applications
- `/admin/alumni` - Manage alumni
- `/admin/contacts` - View messages
- `/admin/courses` - Manage courses
- `/admin/faculty` - Faculty management
- `/admin/awards` - Awards management

## Creating Additional Admin Users

Only superadmins can create new admin users.

### Method 1: Via API
```bash
POST http://localhost:5000/api/auth/register
Authorization: Bearer <superadmin_token>
Content-Type: application/json

{
  "name": "New Admin",
  "email": "newadmin@ssvgi.edu",
  "password": "securepassword123",
  "role": "admin"
}
```

### Method 2: Via Database
```javascript
// In MongoDB shell (mongosh)
use ssvgi
db.admins.insertOne({
  name: "New Admin",
  email: "newadmin@ssvgi.edu",
  password: "$2a$10$...", // bcrypt hashed password
  role: "admin",
  isActive: true,
  createdAt: new Date()
})
```

## Next Steps

1. **Change default admin password**
2. **Configure email notifications** (for form submissions)
3. **Add file upload functionality** (for profile pictures, documents)
4. **Implement data export** (CSV/Excel for reports)
5. **Add analytics dashboard** (charts and graphs)
6. **Setup automatic backups** (MongoDB backup strategy)

## Support & Documentation

- Backend API Documentation: See `server/README.md`
- Frontend Documentation: See main `README.md`
- MongoDB Documentation: https://docs.mongodb.com/
- Express.js Documentation: https://expressjs.com/
- React Documentation: https://react.dev/

## License

Private - SSVGI Educational Institution © 2025
