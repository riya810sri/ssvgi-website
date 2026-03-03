import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  getFees, 
  getFeeStats, 
  createFee, 
  updateFee, 
  deleteFee,
  createFeeTransaction,
  getStudentFees,
  getFeeTransactions,
  getStudentTransactions
} from '../../utils/api';
import Receipt from '../../components/admin/Receipt';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function Fees() {
  const { token } = useAuth();
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showStudentDetailsModal, setShowStudentDetailsModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  
  const receiptRef = useRef();
  const [selectedFee, setSelectedFee] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  const [feeForm, setFeeForm] = useState({
    studentId: '',
    course: '',
    totalFee: '',
    academicYear: new Date().getFullYear().toString(),
    semester: '1',
    dueDate: '',
    feeStructure: {
      tuition: '',
      development: '',
      exam: '',
      library: '',
      other: ''
    },
    notes: ''
  });
  
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentMethod: 'cash',
    transactionId: '',
    notes: ''
  });

  const fetchFees = useCallback(async () => {
    try {
      const queryParams = {};
      if (search) queryParams.search = search;
      if (filter !== 'all') queryParams.status = filter;

      const response = await getFees(token, queryParams);
      setFees(response.data);
    } catch (error) {
      console.error('Error fetching fees:', error);
    } finally {
      setLoading(false);
    }
  }, [search, filter, token]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await getFeeStats(token);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching fee stats:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchFees();
    fetchStats();
  }, [fetchFees, fetchStats]);

  const handleCreateFee = async () => {
    if (!feeForm.studentId || !feeForm.course || !feeForm.totalFee) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const feeData = {
        ...feeForm,
        totalFee: parseFloat(feeForm.totalFee),
        feeStructure: {
          tuition: parseFloat(feeForm.feeStructure.tuition) || 0,
          development: parseFloat(feeForm.feeStructure.development) || 0,
          exam: parseFloat(feeForm.feeStructure.exam) || 0,
          library: parseFloat(feeForm.feeStructure.library) || 0,
          other: parseFloat(feeForm.feeStructure.other) || 0
        }
      };

      await createFee(token, feeData);
      alert('Fee record created successfully');
      setShowCreateModal(false);
      resetFeeForm();
      fetchFees();
      fetchStats();
    } catch (error) {
      alert('Failed to create fee: ' + error.message);
    }
  };

  const resetFeeForm = () => {
    setFeeForm({
      studentId: '',
      course: '',
      totalFee: '',
      academicYear: new Date().getFullYear().toString(),
      semester: '1',
      dueDate: '',
      feeStructure: {
        tuition: '',
        development: '',
        exam: '',
        library: '',
        other: ''
      },
      notes: ''
    });
  };

  const handleRecordPayment = async () => {
    if (!paymentForm.amount || !selectedFee) {
      alert('Please enter payment amount and select a fee record');
      return;
    }

    try {
      const transactionData = {
        feeId: selectedFee._id,
        studentId: selectedFee.studentId._id,
        amount: parseFloat(paymentForm.amount),
        paymentMethod: paymentForm.paymentMethod,
        transactionId: paymentForm.transactionId || undefined,
        notes: paymentForm.notes
      };

      await createFeeTransaction(token, transactionData);
      alert('Payment recorded successfully');
      setShowPaymentModal(false);
      setPaymentForm({
        amount: '',
        paymentMethod: 'cash',
        transactionId: '',
        notes: ''
      });
      fetchFees();
      fetchStats();
      
      if (selectedStudent) {
        await fetchStudentDetails(selectedStudent._id);
      }
    } catch (error) {
      alert('Failed to record payment: ' + error.message);
    }
  };

  const handleDeleteFee = async (feeId) => {
    if (window.confirm('Are you sure you want to delete this fee record? This will also delete related transactions.')) {
      try {
        await deleteFee(token, feeId);
        alert('Fee record deleted successfully');
        fetchFees();
        fetchStats();
      } catch (error) {
        alert('Failed to delete fee: ' + error.message);
      }
    }
  };

  const fetchStudentDetails = async (studentId) => {
    try {
      const response = await getStudentFees(token, studentId);
      setSelectedStudent(response.data);
      setShowStudentDetailsModal(true);
    } catch (error) {
      alert('Failed to fetch student details: ' + error.message);
    }
  };

  const downloadReceipt = async (transaction) => {
    try {
      // Get the fee record for this transaction
      const fee = fees.find(f => f._id === transaction.feeId);
      if (!fee) {
        alert('Fee record not found for this transaction');
        return;
      }

      // Get student details
      const student = fee.studentId;
      
      // Set the receipt data
      setSelectedReceipt({
        transaction,
        fee,
        student
      });
      
      // Show receipt modal
      setShowReceiptModal(true);
      
      // Wait for modal to render
      setTimeout(async () => {
        if (receiptRef.current) {
          const canvas = await html2canvas(receiptRef.current);
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgWidth = 210; // A4 width in mm
          const pageHeight = 297; // A4 height in mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let heightLeft = imgHeight;
          let position = 0;

          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          // Add pages if content is longer than one page
          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }

          pdf.save(`receipt-${transaction.receiptNumber}.pdf`);
          setShowReceiptModal(false);
        }
      }, 500);
    } catch (error) {
      alert('Failed to generate receipt: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'partial': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Fee Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
        >
          Add Fee Record
        </button>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-600">Total Records</p>
            <p className="text-2xl font-bold text-blue-800">{stats.totalFees || 0}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-800">{stats.totalPending || 0}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg border border-blue-300">
            <p className="text-sm text-blue-700">Partial</p>
            <p className="text-2xl font-bold text-blue-900">{stats.totalPartial || 0}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-green-600">Paid</p>
            <p className="text-2xl font-bold text-green-800">{stats.totalPaid || 0}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-sm text-red-600">Overdue</p>
            <p className="text-2xl font-bold text-red-800">{stats.totalOverdue || 0}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, email, or course..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No fee records found
                  </td>
                </tr>
              ) : (
                fees.map((fee) => (
                  <tr key={fee._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{fee.studentName}</div>
                      <div className="text-sm text-gray-500">{fee.studentId?.studentId || fee.studentEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {fee.course}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{fee.totalFee?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{fee.paidAmount?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{fee.pendingAmount?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(fee.status)}`}>
                        {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-y-2">
                      <button
                        onClick={() => {
                          setSelectedFee(fee);
                          fetchStudentDetails(fee.studentId._id);
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 block w-full"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          setSelectedFee(fee);
                          setShowPaymentModal(true);
                        }}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 block w-full"
                      >
                        Record Payment
                      </button>
                      <button
                        onClick={() => handleDeleteFee(fee._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 block w-full"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Fee Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create Fee Record</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student ID <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={feeForm.studentId}
                    onChange={(e) => setFeeForm({...feeForm, studentId: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Enter student ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={feeForm.course}
                    onChange={(e) => setFeeForm({...feeForm, course: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Enter course name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Fee <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    value={feeForm.totalFee}
                    onChange={(e) => setFeeForm({...feeForm, totalFee: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Enter total fee amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                  <input
                    type="text"
                    value={feeForm.academicYear}
                    onChange={(e) => setFeeForm({...feeForm, academicYear: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="e.g., 2024-2025"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                  <select
                    value={feeForm.semester}
                    onChange={(e) => setFeeForm({...feeForm, semester: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={feeForm.dueDate}
                  onChange={(e) => setFeeForm({...feeForm, dueDate: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fee Structure Breakdown</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Tuition</label>
                    <input
                      type="number"
                      value={feeForm.feeStructure.tuition}
                      onChange={(e) => setFeeForm({
                        ...feeForm,
                        feeStructure: {...feeForm.feeStructure, tuition: e.target.value}
                      })}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Development</label>
                    <input
                      type="number"
                      value={feeForm.feeStructure.development}
                      onChange={(e) => setFeeForm({
                        ...feeForm,
                        feeStructure: {...feeForm.feeStructure, development: e.target.value}
                      })}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Exam</label>
                    <input
                      type="number"
                      value={feeForm.feeStructure.exam}
                      onChange={(e) => setFeeForm({
                        ...feeForm,
                        feeStructure: {...feeForm.feeStructure, exam: e.target.value}
                      })}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Library</label>
                    <input
                      type="number"
                      value={feeForm.feeStructure.library}
                      onChange={(e) => setFeeForm({
                        ...feeForm,
                        feeStructure: {...feeForm.feeStructure, library: e.target.value}
                      })}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Other</label>
                    <input
                      type="number"
                      value={feeForm.feeStructure.other}
                      onChange={(e) => setFeeForm({
                        ...feeForm,
                        feeStructure: {...feeForm.feeStructure, other: e.target.value}
                      })}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={feeForm.notes}
                  onChange={(e) => setFeeForm({...feeForm, notes: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows="3"
                  placeholder="Additional notes about the fee"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetFeeForm();
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFee}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create Fee Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showPaymentModal && selectedFee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Record Payment</h2>
            
            <div className="mb-4 p-4 bg-gray-50 rounded">
              <h3 className="font-medium text-gray-800 mb-2">Fee Details</h3>
              <p><strong>Student:</strong> {selectedFee.studentName}</p>
              <p><strong>Course:</strong> {selectedFee.course}</p>
              <p><strong>Total Fee:</strong> ₹{selectedFee.totalFee?.toLocaleString()}</p>
              <p><strong>Pending Amount:</strong> ₹{selectedFee.pendingAmount?.toLocaleString()}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder={`Enter amount (Max: ${selectedFee.pendingAmount})`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select
                  value={paymentForm.paymentMethod}
                  onChange={(e) => setPaymentForm({...paymentForm, paymentMethod: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="cash">Cash</option>
                  <option value="online">Online</option>
                  <option value="cheque">Cheque</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {paymentForm.paymentMethod !== 'cash' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transaction ID</label>
                  <input
                    type="text"
                    value={paymentForm.transactionId}
                    onChange={(e) => setPaymentForm({...paymentForm, transactionId: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Enter transaction ID"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({...paymentForm, notes: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows="3"
                  placeholder="Additional notes about the payment"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentForm({
                    amount: '',
                    paymentMethod: 'cash',
                    transactionId: '',
                    notes: ''
                  });
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordPayment}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Record Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Details Modal */}
      {showStudentDetailsModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Student Fee Details</h2>

            <div className="mb-6">
              <h3 className="font-medium text-lg mb-3">Fee Records</h3>
              {selectedStudent.fees && selectedStudent.fees.map((fee, index) => (
                <div key={index} className="border border-gray-200 rounded p-4 mb-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Course</p>
                      <p className="font-medium">{fee.course}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Academic Year</p>
                      <p className="font-medium">{fee.academicYear}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Semester</p>
                      <p className="font-medium">{fee.semester}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className={`font-medium ${getStatusColor(fee.status)}`}>
                        {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Fee</p>
                      <p className="font-medium">₹{fee.totalFee?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Paid Amount</p>
                      <p className="font-medium">₹{fee.paidAmount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pending Amount</p>
                      <p className="font-medium">₹{fee.pendingAmount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Due Date</p>
                      <p className="font-medium">{fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                  
                  {fee.feeStructure && (
                    <div className="mt-3">
                      <p className="text-sm font-medium">Fee Structure:</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {fee.feeStructure.tuition > 0 && <span className="bg-blue-100 px-2 py-1">Tuition: ₹{fee.feeStructure.tuition}</span>}
                        {fee.feeStructure.development > 0 && <span className="bg-blue-100 px-2 py-1">Development: ₹{fee.feeStructure.development}</span>}
                        {fee.feeStructure.exam > 0 && <span className="bg-blue-100 px-2 py-1">Exam: ₹{fee.feeStructure.exam}</span>}
                        {fee.feeStructure.library > 0 && <span className="bg-blue-100 px-2 py-1">Library: ₹{fee.feeStructure.library}</span>}
                        {fee.feeStructure.other > 0 && <span className="bg-blue-100 px-2 py-1">Other: ₹{fee.feeStructure.other}</span>}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {selectedStudent.transactions && selectedStudent.transactions.length > 0 && (
              <div>
                <h3 className="font-medium text-lg mb-3">Payment Transactions</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt #</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedStudent.transactions.map((transaction, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm">{new Date(transaction.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-2 text-sm font-medium">₹{transaction.amount?.toLocaleString()}</td>
                          <td className="px-4 py-2 text-sm">{transaction.paymentMethod}</td>
                          <td className="px-4 py-2 text-sm">
                            <span className={`px-2 py-1 rounded text-xs ${
                              transaction.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                              transaction.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              transaction.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {transaction.paymentStatus}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm">{transaction.receiptNumber}</td>
                          <td className="px-4 py-2 text-sm">
                            <button
                              onClick={() => downloadReceipt(transaction)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Download Receipt
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setShowStudentDetailsModal(false);
                  setSelectedStudent(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && selectedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Receipt Preview</h2>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div ref={receiptRef} className="receipt-preview">
              <Receipt 
                transaction={selectedReceipt.transaction} 
                fee={selectedReceipt.fee} 
                student={selectedReceipt.student} 
              />
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => downloadReceipt(selectedReceipt.transaction)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}