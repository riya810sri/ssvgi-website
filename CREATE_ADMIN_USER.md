# 🔐 Fix Login Issue - Create Admin User

## Problem
Getting `401 Unauthorized` when trying to login because no admin user exists in the database.

## Solution: Create Admin User on MongoDB Atlas

### Option 1: Run Seed Script Locally (Recommended)

1. **Update `.env` with MongoDB Atlas URI:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ssvgi
   ```

2. **Run the seed script:**
   ```bash
   cd server
   npm install
   npm run seed
   ```

3. **Expected output:**
   ```
   ✅ Connected to MongoDB
   ✅ Admin created successfully!
   Email: admin@ssvgi.edu
   Password: admin123
   Role: master
   ```

### Option 2: Create Admin via Render Console

If you can't run locally:

1. Go to Render Dashboard → Your backend service
2. Add these **Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ssvgi
   ADMIN_EMAIL=admin@ssvgi.edu
   ADMIN_PASSWORD=admin123
   ```
3. Redeploy the service
4. Use SSH or logs to run: `npm run seed`

### Option 3: Manual MongoDB Insert

1. Go to MongoDB Atlas → Collections
2. Select `ssvgi` database → `admins` collection
3. Click **Insert Document**
4. Use this document (password is already hashed for "admin123"):

```json
{
  "name": "Admin",
  "email": "admin@ssvgi.edu",
  "password": "$2a$10$JxHqg7z8KqN9zVvL5pWzQu8hN9zVvL5pWzQu8hN9zVvL5pWzQu8h",
  "role": "master",
  "isActive": true,
  "createdAt": {"$date": "2024-01-01T00:00:00.000Z"}
}
```

⚠️ **Note**: The hashed password above is an example. Use the seed script for correct hashing.

## Test Login

After creating the admin:

1. Go to: `http://localhost:3000/admin/login`
2. Login with:
   - **Email**: `admin@ssvgi.edu`
   - **Password**: `admin123`
3. You should be redirected to `/master/dashboard`

## For User Login

If user login also fails, run:
```bash
npm run setup-users
```

Or create users from the admin dashboard after logging in.

## Troubleshooting

### Still getting 401?

1. Check Render logs for errors
2. Verify MongoDB Atlas connection string
3. Check if admin exists in MongoDB:
   ```javascript
   // In MongoDB Atlas or mongosh
   db.admins.find({})
   ```

### Password not working?

Delete and recreate:
```javascript
// In MongoDB Atlas or mongosh
db.admins.deleteMany({})
// Then run: npm run seed
```
