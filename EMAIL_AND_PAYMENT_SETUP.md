# Email & Payment Integration Setup Guide

## Overview

This guide explains how to set up email notifications and Razorpay payment integration for the SSVGI website.

## Features Implemented

### 1. Email Functionality
- Welcome email sent automatically when admin creates student account
- Email contains student credentials (ID, enrollment number, email, password, course)
- Payment receipt email sent after successful payment
- Beautiful HTML email templates with responsive design

### 2. Payment Integration
- Razorpay payment gateway integration
- Create payment orders for courses
- Secure payment verification with signature validation
- Payment history tracking for students
- Payment statistics for admin/master
- Automatic receipt generation and email delivery

---

## Backend Setup

### Step 1: Install Dependencies

The required packages are already installed:
```bash
npm install nodemailer razorpay
```

### Step 2: Configure Environment Variables

Add the following to your `server/.env` file:

```env
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM_NAME=SSVGI
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Step 3: Gmail App Password Setup

If using Gmail:

1. Go to Google Account settings: https://myaccount.google.com/
2. Navigate to Security
3. Enable 2-Step Verification
4. Generate App Password:
   - Search for "App passwords"
   - Select app: "Mail"
   - Select device: "Other (Custom name)"
   - Name it: "SSVGI Website"
   - Copy the generated 16-character password
5. Use this password in `EMAIL_PASSWORD` environment variable

### Step 4: Razorpay Account Setup

1. Sign up at: https://razorpay.com/
2. Login to dashboard
3. Go to Settings ’ API Keys
4. Generate API Keys (Test Mode):
   - Copy `Key Id` ’ Use as `RAZORPAY_KEY_ID`
   - Copy `Key Secret` ’ Use as `RAZORPAY_KEY_SECRET`
5. For production, switch to Live Mode and generate live keys

### Step 5: Backend Files Created

The following files were created/modified:

- `server/config/email.js` - Email configuration and templates
- `server/config/razorpay.js` - Razorpay configuration
- `server/models/Payment.js` - Payment schema
- `server/controllers/paymentController.js` - Payment API endpoints
- `server/routes/payments.js` - Payment routes
- `server/controllers/userManagementController.js` - Updated with email sending
- `server/server.js` - Added payment routes
- `server/.env.example` - Updated with email & payment variables

---

## Frontend Setup

### Frontend Files Created/Modified

- `src/components/PaymentButton.jsx` - Reusable payment button component
- `src/pages/user/Payments.jsx` - Payment history page
- `src/components/UserLayout.jsx` - Added payments navigation
- `src/utils/api.js` - Added payment API functions
- `src/App.js` - Payments route already configured

### Add Razorpay Script to HTML

Add this to `public/index.html` before closing `</body>` tag:

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

---

## Testing

### 1. Test Email Functionality

**Create a test student account:**

1. Login as Master: http://localhost:3000/admin/login
   - Email: `master@ssvgi.edu`
   - Password: `admin123`

2. Go to Admissions ’ Approve an admission

3. Login as Admin: http://localhost:3000/admin/login
   - Email: `admin@ssvgi.edu`
   - Password: `admin123`

4. Go to Admissions ’ Click "Create User" on approved admission
   - Enter password: `test123`
   - Enter student ID: `STU2024001`
   - Enter enrollment number: `ENR2024001`
   - Click "Create User"

5. Check email inbox - you should receive welcome email with credentials

### 2. Test Payment Functionality

**Option A: Test with Razorpay Test Mode**

1. Login as Student: http://localhost:3000/login
   - Email: `test@student.com`
   - Password: `admin123`

2. Go to any course page with PaymentButton component

3. Click "Pay Now" button

4. Razorpay modal opens

5. Use test card details:
   - Card Number: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date
   - Name: Any name

6. Complete payment

7. Check:
   - Success message shown
   - Payment appears in `/user/payments` page
   - Receipt email sent to student email

**Option B: Using API directly**

```bash
# 1. Login as student
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@student.com","password":"admin123"}'

# Save the token from response

# 2. Create payment order
curl -X POST http://localhost:5000/api/payments/create-order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "amount": 5000,
    "course": "BBA",
    "courseName": "Bachelor of Business Administration"
  }'

# 3. View payment history
curl http://localhost:5000/api/payments/my-payments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## API Endpoints

### Payment Endpoints

**Student Endpoints:**

```
POST   /api/payments/create-order     - Create payment order
POST   /api/payments/verify           - Verify payment
GET    /api/payments/my-payments      - Get user's payment history
```

**Admin/Master Endpoints:**

```
GET    /api/payments/all              - Get all payments (with filters)
GET    /api/payments/stats            - Get payment statistics
```

### Example API Calls

**Create Payment Order:**
```javascript
const response = await createPaymentOrder(token, {
  amount: 5000,
  course: 'BBA',
  courseName: 'Bachelor of Business Administration'
});
// Returns: { orderId, amount, currency, key }
```

**Verify Payment:**
```javascript
const response = await verifyPayment(token, {
  orderId: 'order_xxx',
  paymentId: 'pay_xxx',
  signature: 'signature_xxx'
});
// Returns: { success: true, payment: {...} }
// Also sends receipt email automatically
```

---

## Using PaymentButton Component

### Basic Usage

```jsx
import PaymentButton from '../components/PaymentButton';

function CoursePage() {
  return (
    <div>
      <h1>BBA Course</h1>
      <p>Price: ¹5,000</p>

      <PaymentButton
        amount={5000}
        course="BBA"
        courseName="Bachelor of Business Administration"
        onSuccess={(payment) => {
          console.log('Payment successful:', payment);
          // Redirect or update UI
        }}
        onFailure={(error) => {
          console.error('Payment failed:', error);
        }}
      />
    </div>
  );
}
```

### Custom Styling

```jsx
<PaymentButton
  amount={10000}
  course="MBA"
  courseName="Master of Business Administration"
  buttonText="Enroll Now - Pay ¹10,000"
  buttonClass="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-bold"
  onSuccess={handleSuccess}
/>
```

---

## Email Templates

### 1. Welcome Email (User Creation)

**Sent when:** Admin creates student account after master approval

**Contains:**
- Student ID
- Enrollment Number
- Email (username)
- Password (plain text for first login)
- Course name
- Login link
- Security notice to change password

### 2. Payment Receipt Email

**Sent when:** Payment is successfully verified

**Contains:**
- Receipt ID
- Order ID
- Payment ID
- Date & Time
- Course name
- Payment method
- Total amount paid
- Success badge

---

## Troubleshooting

### Email Not Sending

**Check 1: Environment Variables**
```bash
cd server
node -e "console.log(process.env.EMAIL_USER, process.env.EMAIL_PASSWORD)"
```

**Check 2: Gmail App Password**
- Make sure you're using App Password, not regular password
- App Password should be 16 characters without spaces

**Check 3: Less Secure Apps**
- Gmail might block access
- Use App Password instead of enabling "Less secure apps"

**Check 4: Server Logs**
```bash
cd server
npm run dev
# Check console for email errors
```

### Payment Not Working

**Check 1: Razorpay Keys**
```bash
cd server
node -e "console.log(process.env.RAZORPAY_KEY_ID, process.env.RAZORPAY_KEY_SECRET)"
```

**Check 2: Frontend Razorpay Script**
- Check `public/index.html` has Razorpay script
- Open browser console, check for errors

**Check 3: Test Mode**
- Make sure Razorpay account is in Test Mode
- Use test card: 4111 1111 1111 1111

**Check 4: CORS Issues**
- Check server CORS configuration allows `http://localhost:3000`

### Payment Verification Failed

**Possible causes:**
1. Invalid signature ’ Check Razorpay secret key
2. Network error ’ Check API endpoint
3. Token expired ’ Re-login as student

**Debug verification:**
```javascript
// In paymentController.js, add logging:
console.log('Order ID:', orderId);
console.log('Payment ID:', paymentId);
console.log('Signature:', signature);
console.log('Generated Signature:', generatedSignature);
```

---

## Security Considerations

### Email

1. **Never commit .env file** - Add to .gitignore
2. **Use App Passwords** - Don't use main Gmail password
3. **Password in email** - Plain text only sent once, ask user to change
4. **Email validation** - Verify email exists before sending

### Payment

1. **Server-side verification** - Never trust client-side data
2. **Signature validation** - Always verify Razorpay signature
3. **HTTPS in production** - Use SSL certificates
4. **Key security** - Never expose Razorpay secret key to frontend
5. **Amount validation** - Verify amount on server before creating order

---

## Production Checklist

Before going live:

- [ ] Change Razorpay from Test Mode to Live Mode
- [ ] Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` with live keys
- [ ] Update `FRONTEND_URL` to production domain
- [ ] Setup SSL certificate (HTTPS)
- [ ] Configure production email service (SendGrid, AWS SES, etc.)
- [ ] Update `EMAIL_FROM_NAME` to official name
- [ ] Test payment with real card (small amount)
- [ ] Test email delivery to various email providers
- [ ] Setup webhook for payment status updates
- [ ] Add payment logs and monitoring
- [ ] Configure error alerting for failed payments/emails

---

## File Structure

```
server/
   config/
      email.js           # Email configuration & templates
      razorpay.js        # Razorpay configuration
   controllers/
      paymentController.js          # Payment API logic
      userManagementController.js   # User creation + email
   models/
      Payment.js         # Payment schema
   routes/
      payments.js        # Payment routes
   .env.example           # Environment variables template

src/
   components/
      PaymentButton.jsx  # Reusable payment button
      UserLayout.jsx     # Updated with payments nav
   pages/
      user/
          Payments.jsx   # Payment history page
   utils/
       api.js             # Payment API functions
```

---

## Support

For issues or questions:

1. Check server logs: `cd server && npm run dev`
2. Check browser console: Press F12
3. Check network tab for API errors
4. Verify .env configuration
5. Test with curl commands provided above

---

## Summary

All features are now implemented:

 Email sending on user creation with credentials
 Razorpay payment integration for courses
 Payment receipt email after successful payment
 Payment history page for students
 Payment statistics for admin/master
 Secure payment verification
 Beautiful HTML email templates
 Reusable payment button component

**Next steps:** Configure your .env file and test the complete flow!
