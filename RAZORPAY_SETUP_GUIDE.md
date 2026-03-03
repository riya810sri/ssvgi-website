# Razorpay Payment Setup - Fix Karo

## Problem: Payment Button Click Karne Par Razorpay Open Nahi Ho Raha

### Solution: Real Razorpay Keys Setup Karo

## Step-by-Step Guide

### 1. Razorpay Account Banao (FREE)

1. **Website pe jao:** https://razorpay.com/
2. **Sign Up karo:**
   - Email enter karo
   - Password create karo
   - Mobile number verify karo
   - OTP enter karo

3. **Dashboard open hoga**

### 2. Test Mode Keys Generate Karo

1. Dashboard me **Settings** → **API Keys** pe click karo
2. **Mode** check karo - **Test Mode** selected hona chahiye (blue toggle)
3. **Generate Test Key** button click karo
4. Two keys milenge:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret** (starts with any random string)
5. **Copy karo** - ek jagah save kar lo

### 3. .env File Me Keys Add Karo

**File:** `server/.env`

Replace karo ye lines:

```env
# BEFORE (Dummy keys - won't work)
RAZORPAY_KEY_ID=rzp_test_1234567890
RAZORPAY_KEY_SECRET=test_secret_1234567890

# AFTER (Your real test keys)
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
RAZORPAY_KEY_SECRET=YYYYYYYYYYYYYYYY
```

**Important:**
- `rzp_test_` se start hona chahiye Key ID
- Quotes mat lagao
- Spaces mat do

### 4. Server Restart Karo

Backend server restart karna padega:

**Terminal me:**
```bash
# Stop server: Ctrl + C
# Start again:
cd server
npm run dev
```

**Check karo console me:**
```
✅ Razorpay configured     <- Ye message aana chahiye
✅ Connected to MongoDB
🚀 Server running on port 5000
```

Agar "⚠️ Razorpay not configured" dikhe, to keys galat hain ya .env file nahi save hui.

### 5. Ab Test Karo

**Payment button click karo:**

1. Student login karo
2. Course page pe jao
3. "Pay Now" button click karo
4. Razorpay modal **ab open hoga** ✅

**Test Card Details (Razorpay Test Mode):**

```
Card Number: 4111 1111 1111 1111
CVV: 123
Expiry Date: Any future date (e.g., 12/25)
Name: Any Name
```

### 6. Test Payment Complete Karo

1. Card details enter karo
2. "Pay" button click karo
3. Payment successful!
4. Receipt email jayega (if email configured)
5. `/user/payments` page me payment show hogi

---

## Common Errors & Solutions

### Error 1: "Payment service not configured"

**Reason:** Razorpay keys missing ya galat hain

**Fix:**
```bash
# Check .env file
cat server/.env | grep RAZORPAY

# Output aisa hona chahiye:
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
RAZORPAY_KEY_SECRET=YYYYYYYYYYYYYYYY

# Agar "your_razorpay_key_id" dikhe to real keys add karo
```

### Error 2: Modal Open Nahi Ho Raha

**Possible Reasons:**

1. **Razorpay script missing**
   
   **Check:** `public/index.html` me ye line honi chahiye:
   ```html
   <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
   ```

2. **User logged out hai**
   
   **Fix:** Login karo as student (`test@student.com` / `admin123`)

3. **Console errors**
   
   **Check:** Browser console (F12) me errors dekho

### Error 3: "Invalid key_id"

**Reason:** Wrong Razorpay key ya Live key use kar rahe ho

**Fix:**
- Test Mode me ho Razorpay dashboard pe
- Key ID `rzp_test_` se start honi chahiye
- Live keys (`rzp_live_`) test mode me work nahi karenge

### Error 4: Payment Successful but Verification Failed

**Reason:** Key Secret galat hai

**Fix:**
- Key Secret check karo `.env` file me
- Spaces ya quotes nahi hone chahiye
- Server restart karo

---

## Screenshots Reference

### Razorpay Dashboard - Test Mode

```
┌─────────────────────────────────┐
│  Razorpay Dashboard             │
│                                 │
│  Settings → API Keys            │
│                                 │
│  Mode: ⚪ Live  🔵 Test        │
│        (Test select karo)       │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Generate Test Key       │   │
│  └─────────────────────────┘   │
│                                 │
│  Key ID:                        │
│  rzp_test_XXXXXXXXXX           │
│  [Copy]                         │
│                                 │
│  Key Secret:                    │
│  YYYYYYYYYYYYYYYY              │
│  [Reveal] [Copy]                │
│                                 │
└─────────────────────────────────┘
```

---

## Quick Checklist

Payment button fix karne ke liye:

- [ ] Razorpay account banaya
- [ ] Test Mode me API Keys generate kiye
- [ ] `server/.env` file me keys add kiye
- [ ] Keys `rzp_test_` se start hoti hain
- [ ] Server restart kiya
- [ ] Console me "✅ Razorpay configured" dikha
- [ ] Student login kiya
- [ ] Payment button click kiya
- [ ] Razorpay modal open hua
- [ ] Test card se payment kiya
- [ ] Payment successful!

---

## Important Notes

### Test Mode vs Live Mode

**Test Mode (Development):**
- FREE testing
- Fake payments
- Test cards work
- No real money
- Keys: `rzp_test_XXXXXXXXXX`

**Live Mode (Production):**
- Real payments
- Real money transactions
- Business verification required
- Keys: `rzp_live_XXXXXXXXXX`
- **Abhi mat use karo!**

### Security

1. **.env file ko git me commit mat karo**
   ```bash
   # .gitignore me add karo
   server/.env
   ```

2. **Key Secret ko kabhi frontend me mat bhejo**
   - Backend pe hi use hota hai
   - API calls me include mat karo

3. **Production me:**
   - HTTPS use karo
   - Environment variables properly set karo
   - Live keys use karo (after business verification)

---

## Support

Agar abhi bhi problem ho:

1. **Server logs check karo:**
   ```bash
   cd server
   npm run dev
   # Console output dekho
   ```

2. **Browser console check karo:**
   - F12 press karo
   - Console tab kholo
   - Errors dekho

3. **Razorpay dashboard check karo:**
   - Test Mode selected hai?
   - Keys valid hain?
   - Keys copied correctly?

4. **Environment check karo:**
   ```bash
   # Backend me ye command run karo
   cd server
   node -e "require('dotenv').config(); console.log('Key ID:', process.env.RAZORPAY_KEY_ID); console.log('Has Secret:', !!process.env.RAZORPAY_KEY_SECRET);"
   ```

---

## Summary

**Current Status:**

✅ Backend code ready
✅ Frontend component ready
✅ Payment routes working
⚠️ Need real Razorpay test keys

**Next Steps:**

1. Razorpay account banao → https://razorpay.com/
2. Test keys generate karo
3. `.env` file update karo
4. Server restart karo
5. Test karo!

**Time Required:** 5-10 minutes for complete setup

**Cost:** FREE (Test Mode)

---

## Demo Video Tutorial

Razorpay Test Keys kaise banaye:
https://razorpay.com/docs/payments/dashboard/account-settings/api-keys/

Complete Documentation:
https://razorpay.com/docs/

---

Abhi keys setup karo aur payment test karo! 🚀
