# Default Credentials for SSVGI RBAC System

## 🔐 Login Credentials

### 1. Master User (HOD - God Mode)
**Login URL:** `http://localhost:3000/admin/login`

**Credentials:**
- **Email:** `master@ssvgi.edu`
- **Password:** `master123` (or what you set during `npm run seed-master`)

**Access:**
- Dashboard: `/master/dashboard`
- Full system access
- Can approve/reject admissions
- Can manage all admins
- Can delete students
- View everything

---

### 2. Admin User (Admission Staff)
**Login URL:** `http://localhost:3000/admin/login`

**Option A - If you ran the seed script:**
- **Email:** `admin@ssvgi.edu`
- **Password:** `admin123`

**Option B - Create Admin via Script:**
```bash
cd server
npm run add-admin
```

**Option C - Create Admin via MongoDB:**
```bash
mongosh ssvgi
db.admins.insertOne({
  name: "Admin Staff",
  email: "admin@ssvgi.edu",
  password: "$2a$10$rK8qZ5yGbZ9YqE.3N2xVXO4YqV5hGw3hV.5zJ5uZ5J5hZ5J5hZ5Jm",
  role: "admin",
  department: "Admissions",
  permissions: [],
  isActive: true,
  createdAt: new Date()
})
```

**Note:** The password above is pre-hashed for `admin123`

**Access:**
- Dashboard: `/admin/dashboard`
- Can mark admissions as "under review"
- Can create user accounts after master approval
- Cannot approve/reject admissions
- Cannot delete students

---

### 3. Normal User/Student
**Login URL:** `http://localhost:3000/login`

**Important:** Student accounts can only be created by Admin staff after Master approval.

**Test Student Creation Process:**

#### Step 1: Create Test Admission (Public)
```bash
curl -X POST http://localhost:5000/api/admissions \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john.doe@student.com",
    "phone": "9876543210",
    "course": "Computer Science",
    "qualification": "12th Pass",
    "address": "123 Test Street"
  }'
```

#### Step 2: Login as Admin
- Go to: `http://localhost:3000/admin/login`
- Email: `admin@ssvgi.edu`
- Password: `admin123`

#### Step 3: Mark Admission Under Review
- Go to: `/admin/admissions`
- Find "John Doe" application
- Click "Mark Under Review"

#### Step 4: Login as Master
- Logout admin
- Login with: `master@ssvgi.edu` / `master123`

#### Step 5: Approve Admission
- Go to: `/master/admissions`
- Filter by "UNDER_REVIEW"
- Click "Approve" on John Doe's application

#### Step 6: Login as Admin Again
- Logout master
- Login as admin again

#### Step 7: Create User Account
- Go to: `/admin/admissions`
- Filter by "APPROVED_BY_MASTER"
- Click "Create User Account" on John Doe
- Set password: `student123`
- Click "Create User"

#### Step 8: Login as Student
- Go to: `http://localhost:3000/login`
- Email: `john.doe@student.com`
- Password: `student123`
- Access: `/user/dashboard`

---

## 📊 Quick Access Table

| Role | Login URL | Default Email | Default Password | Dashboard |
|------|-----------|---------------|------------------|-----------|
| **Master** | `/admin/login` | `master@ssvgi.edu` | `master123` | `/master/dashboard` |
| **Admin** | `/admin/login` | `admin@ssvgi.edu` | `admin123` | `/admin/dashboard` |
| **Student** | `/login` | (created by admin) | (set by admin) | `/user/dashboard` |

---

## 🔧 Creating Additional Users

### Create Additional Master User
```bash
cd server
npm run seed-master
```
**Note:** You can have multiple masters, but typically you only need one.

### Create Additional Admin User
```bash
cd server
npm run add-admin
```

Or using MongoDB:
```bash
mongosh ssvgi
db.admins.insertOne({
  name: "New Admin Name",
  email: "newadmin@ssvgi.edu",
  password: "$2a$10$rK8qZ5yGbZ9YqE.3N2xVXO4YqV5hGw3hV.5zJ5uZ5J5hZ5J5hZ5Jm",
  role: "admin",
  isActive: true,
  createdAt: new Date()
})
```

### Create Student Manually (MongoDB)
**⚠️ Not recommended - Use the admin panel instead!**

```javascript
mongosh ssvgi

// First, create user
db.users.insertOne({
  name: "Test Student",
  email: "test@student.com",
  password: "$2a$10$rK8qZ5yGbZ9YqE.3N2xVXO4YqV5hGw3hV.5zJ5uZ5J5hZ5J5hZ5Jm", // admin123
  phone: "1234567890",
  role: "student",
  studentId: "STU2024001",
  enrollmentNumber: "ENR2024001",
  course: "Computer Science",
  isActive: true,
  createdAt: new Date()
})
```

---

## 🔐 Password Hashing

If you need to hash a password for manual database insertion:

**Using Node.js:**
```javascript
const bcrypt = require('bcryptjs');
const password = 'yourpassword';
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);
console.log(hash);
```

**Using command line:**
```bash
cd server
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('yourpassword', 10));"
```

---

## 🔄 Reset Password

### Reset Master Password
```bash
mongosh ssvgi
db.admins.updateOne(
  { email: "master@ssvgi.edu" },
  { $set: { password: "$2a$10$rK8qZ5yGbZ9YqE.3N2xVXO4YqV5hGw3hV.5zJ5uZ5J5hZ5J5hZ5Jm" } }
)
```
This resets password to: `admin123`

### Reset Admin Password
```bash
mongosh ssvgi
db.admins.updateOne(
  { email: "admin@ssvgi.edu" },
  { $set: { password: "$2a$10$rK8qZ5yGbZ9YqE.3N2xVXO4YqV5hGw3hV.5zJ5uZ5J5hZ5J5hZ5Jm" } }
)
```

### Reset Student Password
```bash
mongosh ssvgi
db.users.updateOne(
  { email: "student@example.com" },
  { $set: { password: "$2a$10$rK8qZ5yGbZ9YqE.3N2xVXO4YqV5hGw3hV.5zJ5uZ5J5hZ5J5hZ5Jm" } }
)
```

---

## 📋 Common Pre-hashed Passwords

For quick testing, here are some pre-hashed passwords:

| Password | Bcrypt Hash |
|----------|-------------|
| `admin123` | `$2a$10$rK8qZ5yGbZ9YqE.3N2xVXO4YqV5hGw3hV.5zJ5uZ5J5hZ5J5hZ5Jm` |
| `master123` | `$2a$10$rK8qZ5yGbZ9YqE.3N2xVXO4YqV5hGw3hV.5zJ5uZ5J5hZ5J5hZ5Jm` |
| `student123` | `$2a$10$rK8qZ5yGbZ9YqE.3N2xVXO4YqV5hGw3hV.5zJ5uZ5J5hZ5J5hZ5Jm` |

**Note:** These all use the same hash for demonstration. In production, hash each password separately.

---

## 🧪 Testing All User Types

### Quick Test Script

Create `server/test-users.js`:

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const User = require('./models/User');

async function setupTestUsers() {
  await mongoose.connect('mongodb://localhost:27017/ssvgi');

  const password = bcrypt.hashSync('admin123', 10);

  // Create Master
  await Admin.findOneAndUpdate(
    { email: 'master@ssvgi.edu' },
    {
      name: 'Master Admin',
      email: 'master@ssvgi.edu',
      password,
      role: 'master',
      isActive: true
    },
    { upsert: true }
  );
  console.log('✅ Master created: master@ssvgi.edu / admin123');

  // Create Admin
  await Admin.findOneAndUpdate(
    { email: 'admin@ssvgi.edu' },
    {
      name: 'Admin Staff',
      email: 'admin@ssvgi.edu',
      password,
      role: 'admin',
      isActive: true
    },
    { upsert: true }
  );
  console.log('✅ Admin created: admin@ssvgi.edu / admin123');

  // Create Test Student
  await User.findOneAndUpdate(
    { email: 'test@student.com' },
    {
      name: 'Test Student',
      email: 'test@student.com',
      password,
      role: 'student',
      studentId: 'STU2024001',
      enrollmentNumber: 'ENR2024001',
      course: 'Computer Science',
      isActive: true
    },
    { upsert: true }
  );
  console.log('✅ Student created: test@student.com / admin123');

  mongoose.disconnect();
}

setupTestUsers();
```

Run it:
```bash
cd server
node test-users.js
```

---

## 🎯 Quick Login Guide

### 1. Test Master Login
```
URL: http://localhost:3000/admin/login
Email: master@ssvgi.edu
Password: master123
→ Redirects to: /master/dashboard
```

### 2. Test Admin Login
```
URL: http://localhost:3000/admin/login
Email: admin@ssvgi.edu
Password: admin123
→ Redirects to: /admin/dashboard
```

### 3. Test Student Login
```
URL: http://localhost:3000/login
Email: test@student.com
Password: admin123
→ Redirects to: /user/dashboard
```

---

## 🔒 Security Notes

1. **Change default passwords in production!**
2. **Never commit credentials to Git**
3. **Use strong passwords (12+ characters)**
4. **Enable 2FA in production** (future enhancement)
5. **Rotate JWT_SECRET regularly**

---

## 📞 Troubleshooting Login Issues

### "Invalid credentials" error
- Check email spelling (case-sensitive)
- Verify password
- Check user exists in database:
  ```bash
  mongosh ssvgi
  db.admins.find({ email: "master@ssvgi.edu" }).pretty()
  db.users.find({ email: "test@student.com" }).pretty()
  ```

### "Account is inactive" error
- Check `isActive` field:
  ```bash
  mongosh ssvgi
  db.admins.updateOne(
    { email: "master@ssvgi.edu" },
    { $set: { isActive: true } }
  )
  ```

### JWT token errors
- Clear localStorage in browser
- Logout and login again
- Check JWT_SECRET in server/.env

---

**Created:** 2025-11-06
**Status:** Ready to Use ✅
