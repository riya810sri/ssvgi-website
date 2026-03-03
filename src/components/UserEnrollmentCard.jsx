import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { addEnrollmentPayment } from '../utils/api';

function fmt(n) {
  return `₹ ${Number(n).toFixed(2)}`;
}

export default function UserEnrollmentCard({ enrollment, onUpdate, token }) {
  const { id, courseId, title, totalFee, installments, paidInstallments = [] } = enrollment;
  const paidTotal = useMemo(() => paidInstallments.reduce((s, r) => s + Number(r.amount || 0), 0), [paidInstallments]);
  const remaining = Math.max(0, Number(totalFee) - paidTotal);
  const perInstallment = Math.round((Number(totalFee) / installments) * 100) / 100;

  const [payMode, setPayMode] = useState(false);
  const [payer, setPayer] = useState({ name: '', email: '' });
  const [processing, setProcessing] = useState(false);

  const nextInstallmentNumber = paidInstallments.length + 1;

  const handleChange = (e) => setPayer(p => ({ ...p, [e.target.name]: e.target.value }));

  const handlePay = async () => {
    if (!payer.name || !payer.email) {
      alert('Please enter name and email');
      return;
    }
    setProcessing(true);
    try {
      // optimistic local receipt
      const receipt = {
        id: `REC-${Date.now()}`,
        amount: Math.min(perInstallment, remaining),
        payer: { ...payer },
        date: new Date().toISOString(),
        installmentNo: nextInstallmentNumber,
      };

      // call backend to persist payment
      if (token && enrollment._id) {
        await addEnrollmentPayment(token, enrollment._id, { amount: receipt.amount, payerName: payer.name, method: 'manual' });
      }

      const updated = {
        ...enrollment,
        paidInstallments: [...(enrollment.paidInstallments || []), receipt]
      };

      onUpdate(updated);
      setProcessing(false);
      setPayMode(false);
      setPayer({ name: '', email: '' });
    } catch (err) {
      setProcessing(false);
      alert(err.message || 'Payment failed');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <div className="text-sm text-gray-500">Course ID: {courseId}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Total fee</div>
          <div className="font-bold text-blue-700">{fmt(totalFee)}</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 bg-gray-50 rounded">
          <div className="text-xs text-gray-500">Installments</div>
          <div className="font-semibold">{installments}</div>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <div className="text-xs text-gray-500">Paid</div>
          <div className="font-semibold">{paidInstallments.length}</div>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <div className="text-xs text-gray-500">Remaining</div>
          <div className="font-semibold text-red-600">{fmt(remaining)}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">Per installment</div>
        <div className="text-lg font-semibold">{fmt(perInstallment)}</div>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700">Receipts</h4>
        {paidInstallments.length === 0 ? (
          <div className="text-xs text-gray-500 mt-2">No payments yet.</div>
        ) : (
          <ul className="mt-2 space-y-2">
            {paidInstallments.map((r) => (
              <li key={r.id} className="flex items-center justify-between bg-white border rounded p-2">
                <div>
                  <div className="text-sm font-medium">{r.id} • Installment {r.installmentNo}</div>
                  <div className="text-xs text-gray-500">{new Date(r.date).toLocaleString()} • {r.payer?.name}</div>
                </div>
                <div className="font-semibold text-green-600">{fmt(r.amount)}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button onClick={() => setPayMode(pm => !pm)} className="px-4 py-2 bg-blue-600 text-white rounded">{payMode ? 'Cancel' : `Pay next (${fmt(Math.min(perInstallment, remaining))})`}</button>
        <button onClick={() => {
          // Create receipt HTML matching institute format
          const receiptHTML = paidInstallments.map(receipt => `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                .header { background: #000; color: white; padding: 20px; text-align: center; }
                .receipt { max-width: 800px; margin: 0 auto; border: 1px solid #ddd; }
                .content { padding: 20px; }
                .title { font-size: 24px; margin: 0; }
                .subtitle { font-size: 14px; margin: 5px 0; }
                .details { margin: 20px 0; }
                .row { display: flex; margin: 10px 0; }
                .label { width: 150px; color: #666; }
                .value { flex: 1; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                .signatures { display: flex; justify-content: space-between; margin-top: 50px; }
                .sign-block { text-align: center; width: 200px; }
                .footer { text-align: center; padding: 20px; background: #000; color: white; }
              </style>
            </head>
            <body>
              <div class="receipt">
                <div class="header">
                  <h1 class="title">TESMENTO INSTITUTE</h1>
                  <p class="subtitle">India's Best IT Training Institute</p>
                  <p class="subtitle">Near Ram Janki Mandir, Janakpuri Bareilly [243001]</p>
                </div>
                <div class="content">
                  <h2>FEE RECEIPT</h2>
                  <div class="details">
                    <div class="row">
                      <span class="label">Date:</span>
                      <span class="value">${new Date(receipt.date).toLocaleDateString()}</span>
                      <span class="label">Course:</span>
                      <span class="value">${title}</span>
                    </div>
                    <div class="row">
                      <span class="label">Student Name:</span>
                      <span class="value">${receipt.payer?.name || 'N/A'}</span>
                      <span class="label">Contact:</span>
                      <span class="value">${receipt.payer?.email || 'N/A'}</span>
                    </div>
                  </div>
                  <table>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Particulars</th>
                      <th>Month</th>
                      <th>Amount</th>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>Installment ${receipt.installmentNo}</td>
                      <td>${new Date(receipt.date).toLocaleString('default', { month: 'short' })}-${new Date(receipt.date).getFullYear()}</td>
                      <td>₹ ${receipt.amount}</td>
                    </tr>
                    <tr>
                      <td colspan="3" style="text-align: right"><strong>Total</strong></td>
                      <td><strong>₹ ${receipt.amount}</strong></td>
                    </tr>
                  </table>
                  <div class="signatures">
                    <div class="sign-block">
                      <div style="border-top: 1px solid #000; margin-top: 40px;">Student Sign</div>
                    </div>
                    <div class="sign-block">
                      <div style="border-top: 1px solid #000; margin-top: 40px;">Administrator Sign.</div>
                    </div>
                  </div>
                </div>
                <div class="footer">www.tesmento.com</div>
              </div>
            </body>
            </html>
          `).join('\n\n');

          // Create and download the HTML file
          const blob = new Blob([receiptHTML], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${id}-receipts.html`;
          a.click();
          URL.revokeObjectURL(url);
        }} className="px-4 py-2 border rounded">Download Receipts</button>
      </div>

      {payMode && (
        <div className="mt-4 bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-600">Enter payer details</div>
          <input name="name" value={payer.name} onChange={handleChange} placeholder="Full name" className="w-full mt-2 px-3 py-2 border rounded" />
          <input name="email" value={payer.email} onChange={handleChange} placeholder="Email" className="w-full mt-2 px-3 py-2 border rounded" />
          <div className="mt-3 flex items-center gap-2">
            <button onClick={handlePay} disabled={processing} className="px-4 py-2 bg-green-600 text-white rounded">{processing ? 'Processing…' : 'Pay Now'}</button>
            <button onClick={() => setPayMode(false)} className="px-4 py-2 border rounded">Cancel</button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
