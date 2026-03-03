import React from 'react';

const Receipt = ({ transaction, fee, student }) => {
  if (!transaction || !fee || !student) {
    return <div>Receipt data is incomplete</div>;
  }

  // Format date to readable format
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="receipt-container p-8 bg-white text-black">
      <div className="receipt-header text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">SSVGI Educational Institute</h1>
        <p className="text-gray-600">Fee Payment Receipt</p>
        <p className="text-sm text-gray-500">Receipt #: {transaction.receiptNumber}</p>
        <p className="text-sm text-gray-500">Date: {formatDate(transaction.createdAt)}</p>
      </div>

      <div className="receipt-body border border-gray-300 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-lg mb-3">From:</h3>
            <p className="font-medium">SSVGI Educational Institute</p>
            <p>Address: [Institute Address]</p>
            <p>Phone: [Institute Phone]</p>
            <p>Email: [Institute Email]</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-3">To:</h3>
            <p className="font-medium">{student.name}</p>
            <p>Student ID: {student.studentId}</p>
            <p>Email: {student.email}</p>
            <p>Phone: {student.phone}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-3">Payment Details:</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p><strong>Course:</strong> {fee.course}</p>
              <p><strong>Academic Year:</strong> {fee.academicYear}</p>
              <p><strong>Semester:</strong> {fee.semester}</p>
            </div>
            <div>
              <p><strong>Payment Method:</strong> {transaction.paymentMethod}</p>
              {transaction.transactionId && <p><strong>Transaction ID:</strong> {transaction.transactionId}</p>}
              <p><strong>Amount Paid:</strong> {formatCurrency(transaction.amount)}</p>
            </div>
          </div>
        </div>

        <div className="fee-breakdown border-t border-gray-200 pt-4">
          <h3 className="font-semibold text-lg mb-3">Fee Structure:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 text-sm">
            {fee.feeStructure?.tuition > 0 && (
              <div className="border border-gray-200 rounded p-2">
                <p className="text-gray-600">Tuition Fee</p>
                <p className="font-medium">{formatCurrency(fee.feeStructure.tuition)}</p>
              </div>
            )}
            {fee.feeStructure?.development > 0 && (
              <div className="border border-gray-200 rounded p-2">
                <p className="text-gray-600">Dev. Fee</p>
                <p className="font-medium">{formatCurrency(fee.feeStructure.development)}</p>
              </div>
            )}
            {fee.feeStructure?.exam > 0 && (
              <div className="border border-gray-200 rounded p-2">
                <p className="text-gray-600">Exam Fee</p>
                <p className="font-medium">{formatCurrency(fee.feeStructure.exam)}</p>
              </div>
            )}
            {fee.feeStructure?.library > 0 && (
              <div className="border border-gray-200 rounded p-2">
                <p className="text-gray-600">Library Fee</p>
                <p className="font-medium">{formatCurrency(fee.feeStructure.library)}</p>
              </div>
            )}
            {fee.feeStructure?.other > 0 && (
              <div className="border border-gray-200 rounded p-2">
                <p className="text-gray-600">Other Fee</p>
                <p className="font-medium">{formatCurrency(fee.feeStructure.other)}</p>
              </div>
            )}
          </div>
        </div>

        <div className="summary border-t border-gray-200 pt-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded p-3">
              <p className="text-sm text-gray-600">Total Fee</p>
              <p className="text-lg font-bold">{formatCurrency(fee.totalFee)}</p>
            </div>
            <div className="border border-gray-200 rounded p-3">
              <p className="text-sm text-gray-600">Amount Paid</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(fee.paidAmount)}</p>
            </div>
            <div className="border border-gray-200 rounded p-3">
              <p className="text-sm text-gray-600">Pending Amount</p>
              <p className="text-lg font-bold text-red-600">{formatCurrency(fee.pendingAmount)}</p>
            </div>
          </div>
        </div>

        {transaction.notes && (
          <div className="notes mt-4 pt-4 border-t border-gray-200">
            <p><strong>Notes:</strong> {transaction.notes}</p>
          </div>
        )}
      </div>

      <div className="receipt-footer text-center text-sm text-gray-500">
        <p>This is a computer-generated receipt and is valid without signature.</p>
        <p>Thank you for your payment!</p>
      </div>
    </div>
  );
};

export default Receipt;