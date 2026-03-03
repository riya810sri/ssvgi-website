import React, { useState, useEffect } from 'react';
import { getMyPayments } from '../../utils/api';
import { getStudentTransactions } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function Payments() {
  const [userPayments, setUserPayments] = useState([]);
  const [feeTransactions, setFeeTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, user } = useAuth;

  useEffect(() => {
    fetchAllPayments();
  }, [token]);

  const fetchAllPayments = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch regular payments
      const userPaymentsResponse = await getMyPayments(token);
      setUserPayments(userPaymentsResponse.data || []);
      
      // Fetch fee transactions
      if (user && user._id) {
        const feeTransactionsResponse = await getStudentTransactions(token, user._id);
        setFeeTransactions(feeTransactionsResponse.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  // Combine both types of payments and sort by date
  const allPayments = [
    ...userPayments.map(payment => ({ ...payment, type: 'payment' })),
    ...feeTransactions.map(transaction => ({ 
      ...transaction, 
      type: 'fee_transaction',
      amount: transaction.amount,
      status: transaction.paymentStatus,
      createdAt: transaction.createdAt 
    }))
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const getStatusBadge = (status) => {
    const badges = {
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      created: 'bg-gray-100 text-gray-800'
    };
    return badges[status] || badges.created;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-600 mt-2">View all your payment transactions</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {allPayments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payments Yet</h3>
          <p className="text-gray-600">You have not made any payments yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receipt ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.type === 'payment' ? payment.receiptId : payment.receiptNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500 capitalize">
                        {payment.type === 'payment' ? 'Course Payment' : 'Fee Payment'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {payment.courseName || (payment.feeId && payment.feeId.course) || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">₹{payment.amount?.toFixed(2) || payment.amount || '0.00'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(payment.status)}`}>
                        {payment.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.createdAt).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a 
                        href={`/user/receipts`} 
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Download Receipt
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{allPayments.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-teal-600">
                  ₹{allPayments
                    .filter(p => p.status === 'success' || p.status === 'completed')
                    .reduce((sum, p) => sum + (p.amount || 0), 0)
                    .toFixed(2)
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
