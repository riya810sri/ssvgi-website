import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

// Simple client-side fee / installment UI.
// - Accepts fee as number or string (e.g., "₹ 50,000") and parses numeric value.
// - Lets user choose installments and shows per-installment amount (rounded to 2 decimals).
// - Includes a small simulated payment form (name, email, phone) and a mock Pay button.
// - This is UI-only: replace the `handlePay` implementation to call a real payment API.

function parseFee(value) {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  // remove non-digits and non-dot
  const numeric = value.toString().replace(/[^0-9.]/g, '');
  const parsed = parseFloat(numeric);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function FeeSection({ fee, courseId, courseTitle }) {
  const totalFee = useMemo(() => parseFee(fee), [fee]);
  const options = [1, 3, 6, 12];
  const [installments, setInstallments] = useState(3);
  const [payer, setPayer] = useState({ name: '', email: '', phone: '' });
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(null);

  const perInstallment = useMemo(() => {
    if (!installments || installments <= 0) return totalFee;
    return Math.round((totalFee / installments) * 100) / 100;
  }, [totalFee, installments]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayer((p) => ({ ...p, [name]: value }));
  };

  const handlePay = async () => {
    // Basic client-side validation
    if (!payer.name || !payer.email) {
      alert('Please enter your name and email.');
      return;
    }

    setProcessing(true);
    setSuccess(null);

    // Simulate a network/payment delay
    await new Promise((res) => setTimeout(res, 1200));

    // Here you'd normally call your backend to create an order / session with a payment gateway
    setProcessing(false);
    setSuccess({
      message: `Payment scheduled: ${installments} x ${perInstallment.toFixed(2)} for ${courseTitle || ''}`,
      paidAt: new Date().toISOString(),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="mt-6 p-4 bg-gradient-to-br from-white/60 to-white/40 rounded-lg border border-gray-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-600">Course Fee</div>
          <div className="text-xl font-bold text-green-700">{typeof fee === 'number' ? `₹ ${fee}` : fee}</div>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-500">Choose installments</div>
          <div className="flex gap-2 mt-2">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => setInstallments(opt)}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition ${opt === installments ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-700 border-gray-200'}`}
              >
                {opt} {opt === 1 ? 'pay' : 'inst'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div className="p-3 rounded-md bg-white/60">
          <div className="text-sm text-gray-600">Per Installment</div>
          <div className="text-2xl font-semibold text-blue-800">₹ {perInstallment.toFixed(2)}</div>
          <div className="text-xs text-gray-500 mt-1">Total: ₹ {totalFee.toFixed(2)} • {installments} installment(s)</div>
        </div>

        <div className="p-3 rounded-md bg-white/60">
          <div className="text-sm text-gray-600">Pay Now (Simulated)</div>
          {success ? (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
              <div className="text-green-700 font-medium">Success</div>
              <div className="text-sm text-gray-700 mt-1">{success.message}</div>
              <div className="text-xs text-gray-500 mt-1">Time: {new Date(success.paidAt).toLocaleString()}</div>
            </div>
          ) : (
            <div className="space-y-2 mt-2">
              <input name="name" value={payer.name} onChange={handleChange} placeholder="Full name" className="w-full px-3 py-2 border rounded" />
              <input name="email" value={payer.email} onChange={handleChange} placeholder="Email" className="w-full px-3 py-2 border rounded" />
              <input name="phone" value={payer.phone} onChange={handleChange} placeholder="Phone (optional)" className="w-full px-3 py-2 border rounded" />

              <div className="flex items-center justify-between mt-2">
                <div className="text-sm text-gray-600">Amount now</div>
                <div className="font-semibold">₹ {perInstallment.toFixed(2)}</div>
              </div>

              <div className="flex gap-2 mt-2">
                <button onClick={handlePay} disabled={processing} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60">
                  {processing ? 'Processing…' : `Pay ₹ ${perInstallment.toFixed(2)}`}
                </button>
                <button onClick={() => { setPayer({ name: '', email: '', phone: '' }); setSuccess(null); }} className="px-4 py-2 border rounded">Reset</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-500">Note: This is a simulated payment UI. Replace the payment handler with your backend + gateway integration for real payments.</div>
    </motion.div>
  );
}
