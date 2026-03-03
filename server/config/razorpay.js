const Razorpay = require('razorpay');

// Initialize Razorpay instance only if keys are provided
let razorpay = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
  console.log('✅ Razorpay configured');
} else {
  console.log('⚠️  Razorpay not configured - Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env');
}

module.exports = razorpay;
