# Quick Start Guide - RBAC System

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ..
npm install
```

### Step 2: Setup Environment Variables

Create `server/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/ssvgi
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

### Step 3: Create Master User

```bash
cd server
npm run seed-master
```

Enter the following when prompted:
- **Name:** Master Admin
- **Email:** master@ssvgi.edu
- **Password:** master123

### Step 4: Start the Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm start
```

### Step 5: Test the System

#### 5.1 Login as Master

1. Go to: `http://localhost:3000/admin/login`
2. Login with:
   - Email: `master@ssvgi.edu`
   - Password: `master123`
3. You'll be redirected to: `/master/dashboard`

#### 5.2 Create an Admin User

**Option A: Using MongoDB directly**
```bash
mongo ssvgi
db.admins.insertOne({
  name: "Admission Staff",
  email: "admin@ssvgi.edu",
  password: "$2a$10$abcdefghijklmnopqrstuvwxyz", // pre-hashed "admin123"
  role: "admin",
  isActive: true,
  createdAt: new Date()
})
```

**Option B: Using existing script**
```bash
cd server
npm run add-admin
```

#### 5.3 Test the Complete Flow

**Step A: Create Test Admission (as public user)**
```bash
curl -X POST http://localhost:5000/api/admissions \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test Student",
    "email": "student@test.com",
    "phone": "1234567890",
    "course": "Computer Science",
    "qualification": "12th Pass",
    "address": "Test Address"
  }'
```

**Step B: Login as Admin**
1. Logout from Master account
2. Login with: `admin@ssvgi.edu` / `admin123`
3. Go to: `/admin/admissions`
4. Click "Mark Under Review" on the test admission

**Step C: Login as Master (Approve)**
1. Logout from Admin account
2. Login as Master
3. Go to: `/master/admissions`
4. Filter by "UNDER_REVIEW"
5. Click "Approve" on the test admission

**Step D: Login as Admin (Create User)**
1. Logout from Master account
2. Login as Admin
3. Go to: `/admin/admissions`
4. Filter by "APPROVED_BY_MASTER"
5. Click "Create User Account"
6. Set password: `student123`
7. Click "Create User"

**Step E: Login as Student**
1. Logout from Admin account
2. Go to: `/login` (user login)
3. Login with: `student@test.com` / `student123`
4. Access: `/user/dashboard`

## 🎯 Role Access Matrix

| Feature | Student | Admin | Master |
|---------|---------|-------|--------|
| Personal Dashboard | ✅ | ❌ | ❌ |
| View Own Data | ✅ | ❌ | ❌ |
| Mark Admission Under Review | ❌ | ✅ | ✅ |
| Approve/Reject Admission | ❌ | ❌ | ✅ |
| Create User Credentials | ❌ | ✅ | ✅ |
| View All Students | ❌ | ✅ | ✅ |
| Delete Students | ❌ | ❌ | ✅ |
| Manage Admin Staff | ❌ | ❌ | ✅ |
| System-wide Stats | ❌ | ❌ | ✅ |

## 🔑 Default Credentials

### Master
- URL: `/admin/login`
- Email: `master@ssvgi.edu`
- Password: `master123`
- Redirects to: `/master/dashboard`

### Admin
- URL: `/admin/login`
- Email: `admin@ssvgi.edu`
- Password: `admin123`
- Redirects to: `/admin/dashboard`

### Student
- URL: `/login`
- Email: (created by admin)
- Password: (set by admin)
- Redirects to: `/user/dashboard`

## 🔄 Admission Workflow Status

```
pending → under_review → approved_by_master → user_created
                               ↓
                           rejected
```

1. **pending** - Fresh application from website
2. **under_review** - Admin marked for review
3. **approved_by_master** - Master approved, ready for user creation
4. **rejected** - Master rejected
5. **user_created** - Admin created user credentials

## 📋 Quick Commands Reference

```bash
# Create master user
cd server && npm run seed-master

# Start backend
cd server && npm run dev

# Start frontend
npm start

# View MongoDB data
mongo ssvgi
> show collections
> db.admins.find().pretty()
> db.users.find().pretty()
> db.admissions.find().pretty()
```

## 🐛 Debug Checklist

- [ ] MongoDB is running
- [ ] Backend server is running on port 5000
- [ ] Frontend is running on port 3000
- [ ] `.env` file exists in `server/`
- [ ] Master user created successfully
- [ ] CORS allows localhost:3000
- [ ] Browser console shows no errors
- [ ] Network tab shows successful API calls

## 📖 More Information

See `RBAC_IMPLEMENTATION_GUIDE.md` for:
- Complete API documentation
- Security features
- Database schemas
- Troubleshooting guide
- Future enhancements

---

**Ready to go? Start with Step 1!** 🚀
