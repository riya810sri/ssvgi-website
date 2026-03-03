import React, { useState } from 'react';
import { createPaymentOrder, verifyPayment } from '../utils/api';

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function PaymentButton({
  amount,
  course,
  courseName,
  onSuccess,
  onFailure,
  buttonText = 'Pay Now',
  buttonClass = 'bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition'
}) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Get user token
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('Please login to make payment');
        return;
      }

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Failed to load Razorpay SDK. Please check your internet connection.');
        return;
      }

      // Create order
      const orderData = await createPaymentOrder(token, {
        amount,
        course,
        courseName
      });

      // Configure Razorpay options
      const options = {
        key: orderData.data.key,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: 'SSVGI',
        description: courseName,
        order_id: orderData.data.orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verificationData = {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            };

            const verifyResponse = await verifyPayment(token, verificationData);

            if (verifyResponse.success) {
              alert('Payment successful! Receipt sent to your email.');
              if (onSuccess) onSuccess(verifyResponse.data.payment);
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed. Please contact support.');
            if (onFailure) onFailure(error);
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#667eea'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            console.log('Payment modal closed');
          }
        }
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        alert(`Payment failed: ${response.error.description}`);
        if (onFailure) onFailure(response.error);
        setLoading(false);
      });

      razorpay.open();
      setLoading(false);
    } catch (error) {
      console.error('Payment initiation error:', error);
      alert(error.message || 'Failed to initiate payment');
      if (onFailure) onFailure(error);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={buttonClass}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Processing...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          💳 {buttonText}
        </span>
      )}
    </button>
  );
}
