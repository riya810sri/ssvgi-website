# RBAC (Role-Based Access Control) Implementation Guide

## Overview

This project now implements a complete 3-tier Role-Based Access Control system with the following roles:

1. **User/Student** - Personal dashboard access only
2. **Admin** - Admission staff who can manage forms and create user credentials
3. **Master** - HOD-level access with god mode capabilities

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    RBAC Flow Diagram                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Student applies via website form                         │
│                    ↓                                          │
│  2. Admin marks application as "under review"                │
│                    ↓                                          │
│  3. Master approves/rejects the application                  │
│                    ↓                                          │
│  4. Admin creates user credentials (email + password)        │
│                    ↓                                          │
│  5. Student logs in with credentials                         │
│                    ↓                                          │
│  6. Student accesses personal dashboard                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Role Definitions

### 1. User/Student Role
**Access Level:** `student` or `user`

**Capabilities:**
- Access personal dashboard only
- View own enrollment data
- View own exam results
- View own payment history
- Cannot access admin or master panels

**Dashboard Location:** `/user/*`

### 2. Admin Role
**Access Level:** `admin`

**Capabilities:**
- Mark admissions as "under review"
- Create user credentials after master approval
- Manage application forms on main website
- View all admissions (read-only on master decisions)
- Cannot approve/reject admissions (Master only)
- Cannot delete students (Master only)

**Dashboard Location:** `/admin/*`

### 3. Master Role
**Access Level:** `master`

**Capabilities:**
- **GOD MODE** - Can view everything
- Approve/reject admission applications
- View all students data
- View all admin staff
- Manage admin status (activate/deactivate)
- Delete students
- View exam management
- View enrollment data
- Full system oversight

**Dashboard Location:** `/master/*`

## Backend Implementation

### Database Models

#### 1. User Model (`server/models/User.js`)
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: ['student', 'user'],
  studentId: String (unique),
  enrollmentNumber: String (unique),
  course: String,
  admissionId: ObjectId (ref: Admission),
  createdBy: ObjectId (ref: Admin),
  isActive: Boolean
}
```

#### 2. Admin Model (`server/models/Admin.js`)
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['admin', 'master'],
  department: String,
  permissions: [String],
  isActive: Boolean
}
```

#### 3. Admission Model (`server/models/Admission.js`)
```javascript
{
  fullName: String,
  email: String,
  phone: String,
  course: String,
  qualification: String,
  address: String,
  status: ['pending', 'under_review', 'approved_by_master', 'rejected', 'user_created'],
  notes: String,
  adminNotes: String,
  masterNotes: String,
  reviewedBy: ObjectId (ref: Admin),
  approvedBy: ObjectId (ref: Admin),
  userCreated: Boolean,
  userId: ObjectId (ref: User)
}
```

### Authentication Middleware

#### Unified Auth (`server/middleware/unifiedAuth.js`)
Provides flexible authentication for both admin and user routes:

```javascript
exports.protect          // Authenticates any logged-in user
exports.restrictTo       // Restricts to specific roles
exports.masterOnly       // Master only access
exports.adminOrMaster    // Admin or Master access
exports.studentOnly      // Student only access
```

### API Endpoints

#### Master Endpoints (`/api/master/*`)
```
GET    /api/master/dashboard/stats      - Get master dashboard statistics
GET    /api/master/admins               - Get all admin staff
PUT    /api/master/admins/:id/status    - Update admin status
GET    /api/master/activities           - Get recent system activities
GET    /api/master/exam-results         - Get all exam results
```

#### Admission Approval Endpoints
```
POST   /api/admissions/:id/review       - Admin marks as under review
POST   /api/admissions/:id/approve      - Master approves admission
POST   /api/admissions/:id/reject       - Master rejects admission
```

#### User Management Endpoints (`/api/user-management/*`)
```
POST   /api/user-management/create-from-admission/:admissionId
GET    /api/user-management/students
GET    /api/user-management/students/:id
PUT    /api/user-management/students/:id
DELETE /api/user-management/students/:id    (Master only)
GET    /api/user-management/stats
```

## Frontend Implementation

### Authentication Context (`src/context/AuthContext.jsx`)

Added helper functions:
```javascript
isMaster()           // Returns true if user is master
isAdmin()            // Returns true if user is admin (not master)
isAdminOrMaster()    // Returns true if user is admin or master
```

### Protected Routes

#### MasterProtectedRoute (`src/components/MasterProtectedRoute.jsx`)
- Checks if user is authenticated
- Checks if user has 'master' role
- Redirects non-masters to admin dashboard
- Redirects unauthenticated to login

### Master Panel Pages

1. **Master Dashboard** (`/master/dashboard`)
   - System-wide statistics
   - Admission workflow status
   - Admin management
   - Recent activities

2. **Master Admissions** (`/master/admissions`)
   - View all admissions
   - Approve/reject applications
   - Add master notes

3. **Master Students** (`/master/students`)
   - View all students
   - Delete students
   - Search functionality

### Admin Panel Updates

**Updated Admissions Page** (`/admin/admissions`)
- Mark applications as "under review"
- Create user accounts for approved admissions
- Generate student ID and enrollment number
- Set initial password for students

## Setup Instructions

### 1. Backend Setup

```bash
cd server
npm install

# Create Master user
npm run seed-master

# Start the server
npm run dev
```

When running `npm run seed-master`, you'll be prompted to enter:
- Name
- Email
- Password (min 6 characters)

### 2. Frontend Setup

```bash
npm install
npm start
```

### 3. Database Migration

If you have existing data, you may need to update:

```javascript
// Update existing admins to have proper roles
db.admins.updateMany(
  { role: 'superadmin' },
  { $set: { role: 'master' } }
);

// Update existing users
db.users.updateMany(
  { role: { $in: ['instructor', 'manager'] } },
  { $set: { role: 'student' } }
);
```

## Workflow Examples

### Complete Admission Flow

1. **Student applies on website**
   ```
   POST /api/admissions
   Body: { fullName, email, phone, course, qualification, address }
   Status: 'pending'
   ```

2. **Admin reviews and marks as under review**
   ```
   POST /api/admissions/:id/review
   Headers: { Authorization: Bearer <admin-token> }
   Body: { adminNotes: "Reviewed by admission team" }
   Status: 'pending' → 'under_review'
   ```

3. **Master approves the admission**
   ```
   POST /api/admissions/:id/approve
   Headers: { Authorization: Bearer <master-token> }
   Body: { masterNotes: "Approved for admission" }
   Status: 'under_review' → 'approved_by_master'
   ```

4. **Admin creates user credentials**
   ```
   POST /api/user-management/create-from-admission/:admissionId
   Headers: { Authorization: Bearer <admin-token> }
   Body: {
     password: "studentPass123",
     studentId: "STU2024001",
     enrollmentNumber: "ENR2024001"
   }
   Status: 'approved_by_master' → 'user_created'
   ```

5. **Student logs in and accesses dashboard**
   ```
   POST /api/users/login
   Body: { email: "student@example.com", password: "studentPass123" }

   Access: /user/dashboard
   ```

## Security Features

1. **Password Hashing** - All passwords hashed with bcryptjs
2. **JWT Authentication** - Token-based authentication
3. **Role Validation** - Middleware checks on every protected route
4. **Unique Constraints** - Email, studentId, enrollmentNumber
5. **Active Status Check** - Inactive users cannot access system

## API Testing

### Test with curl

```bash
# Login as Master
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"master@ssvgi.edu","password":"master123"}'

# Get Master Dashboard Stats
curl -X GET http://localhost:5000/api/master/dashboard/stats \
  -H "Authorization: Bearer <token>"

# Approve Admission (Master only)
curl -X POST http://localhost:5000/api/admissions/:id/approve \
  -H "Authorization: Bearer <master-token>" \
  -H "Content-Type: application/json" \
  -d '{"masterNotes":"Approved for CSE program"}'
```

## Troubleshooting

### Common Issues

1. **"Not authorized" error**
   - Check if token is valid
   - Verify role in token payload
   - Ensure middleware is applied correctly

2. **Cannot create user from admission**
   - Verify admission status is 'approved_by_master'
   - Check if user with email already exists
   - Ensure password meets minimum requirements

3. **Master cannot access routes**
   - Verify role is exactly 'master' (not 'superadmin')
   - Check token contains correct role
   - Clear localStorage and re-login

## Future Enhancements

- [ ] Email notifications for admission status changes
- [ ] Bulk user creation from CSV
- [ ] Audit logs for master actions
- [ ] Permission-based granular access
- [ ] Multi-factor authentication
- [ ] Student self-registration with approval flow

## Support

For issues or questions:
- Check console logs in browser (F12)
- Check server logs
- Verify MongoDB connection
- Ensure all environment variables are set

---

**Generated:** 2025-11-06
**Version:** 1.0
**Status:** Production Ready ✅
