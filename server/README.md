# SSVGI Backend Server

Backend API server for the SSVGI Admin Dashboard built with Express.js, MongoDB, and JWT authentication.

## Features

- JWT-based authentication system
- RESTful API endpoints
- MongoDB database integration
- Role-based access control
- CRUD operations for:
  - Admissions
  - Alumni registrations
  - Contact inquiries
  - Courses
  - Faculty
  - Awards

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/ssvgi
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   ADMIN_EMAIL=admin@ssvgi.edu
   ADMIN_PASSWORD=admin123
   ```

## Database Setup

1. Make sure MongoDB is running on your system

2. Create the default admin user:
   ```bash
   npm run seed
   ```

This will create a superadmin account with the credentials specified in your `.env` file.

## Running the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in .env)

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login admin user
- `POST /api/auth/register` - Register new admin (superadmin only)
- `GET /api/auth/me` - Get current user info (protected)
- `PUT /api/auth/updatepassword` - Update password (protected)

### Admissions
- `GET /api/admissions` - Get all admissions (protected)
- `GET /api/admissions/:id` - Get single admission (protected)
- `POST /api/admissions` - Submit application (public)
- `PUT /api/admissions/:id` - Update admission status (protected)
- `DELETE /api/admissions/:id` - Delete admission (protected)
- `GET /api/admissions/stats/overview` - Get statistics (protected)

### Alumni
- `GET /api/alumni` - Get all alumni (protected)
- `GET /api/alumni/:id` - Get single alumni (protected)
- `POST /api/alumni` - Submit alumni registration (public)
- `PUT /api/alumni/:id` - Update alumni (protected)
- `DELETE /api/alumni/:id` - Delete alumni (protected)
- `GET /api/alumni/stats/overview` - Get statistics (protected)

### Contacts
- `GET /api/contacts` - Get all contacts (protected)
- `GET /api/contacts/:id` - Get single contact (protected)
- `POST /api/contacts` - Submit contact message (public)
- `PUT /api/contacts/:id/reply` - Reply to contact (protected)
- `PUT /api/contacts/:id` - Update contact (protected)
- `DELETE /api/contacts/:id` - Delete contact (protected)
- `GET /api/contacts/stats/overview` - Get statistics (protected)

### Courses
- `GET /api/courses` - Get all courses (public)
- `GET /api/courses/:id` - Get single course (public)
- `POST /api/courses` - Create course (protected)
- `PUT /api/courses/:id` - Update course (protected)
- `DELETE /api/courses/:id` - Delete course (protected)

### Faculty
- `GET /api/faculty` - Get all faculties (public)
- `GET /api/faculty/:id` - Get single faculty (public)
- `POST /api/faculty` - Create faculty (protected)
- `PUT /api/faculty/:id` - Update faculty (protected)
- `DELETE /api/faculty/:id` - Delete faculty (protected)

### Awards
- `GET /api/awards` - Get all awards (public)
- `GET /api/awards/:id` - Get single award (public)
- `POST /api/awards` - Create award (protected)
- `PUT /api/awards/:id` - Update award (protected)
- `DELETE /api/awards/:id` - Delete award (protected)

## Authentication

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Default Admin Credentials

After running the seed script:
- Email: `admin@ssvgi.edu` (or as specified in .env)
- Password: `admin123` (or as specified in .env)

**Important:** Change the default password immediately after first login!

## Project Structure

```
server/
├── config/
│   └── db.js              # Database configuration
├── controllers/
│   ├── authController.js
│   ├── admissionController.js
│   ├── alumniController.js
│   ├── contactController.js
│   ├── courseController.js
│   ├── facultyController.js
│   └── awardController.js
├── middleware/
│   └── auth.js            # Authentication middleware
├── models/
│   ├── Admin.js
│   ├── Admission.js
│   ├── Alumni.js
│   ├── Contact.js
│   ├── Course.js
│   ├── Faculty.js
│   └── Award.js
├── routes/
│   ├── auth.js
│   ├── admissions.js
│   ├── alumni.js
│   ├── contacts.js
│   ├── courses.js
│   ├── faculty.js
│   └── awards.js
├── scripts/
│   └── seedAdmin.js       # Seed initial admin user
├── .env.example
├── package.json
├── README.md
└── server.js              # Main entry point
```

## Security Notes

1. Always use HTTPS in production
2. Change the default JWT_SECRET to a strong, random string
3. Update the default admin credentials immediately
4. Keep your `.env` file secure and never commit it to version control
5. Regularly update dependencies to patch security vulnerabilities

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running: `sudo systemctl start mongod` (Linux) or check MongoDB service on Windows/Mac
- Verify the MONGODB_URI in your .env file

### Port Already in Use
- Change the PORT in your .env file to an available port
- Or stop the process using port 5000: `lsof -ti:5000 | xargs kill` (Mac/Linux)

### JWT Authentication Errors
- Make sure JWT_SECRET is set in .env
- Check if the token is being sent correctly in the Authorization header

## License

Private - SSVGI Educational Institution
