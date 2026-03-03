import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminAdmissionForm from '../../components/admin/AdminAdmissionForm';
import {
  getAdmissions,
  updateAdmissionStatus,
  markAdmissionUnderReview,
  createUserFromAdmission,
  deleteAdmission
} from '../../utils/api';

export default function Admissions() {
  const { token } = useAuth();
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [userData, setUserData] = useState({
    password: '',
    studentId: '',
    enrollmentNumber: '',
  });

  // ✅ Correct fetch function
  const fetchAdmissions = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = {};
      if (filter !== 'all') queryParams.status = filter;
      if (search) queryParams.search = search;

      const response = await getAdmissions(token, queryParams);
      setAdmissions(response.data);
    } catch (error) {
      console.error('Error fetching admissions:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, search, token]);

  // ✅ Fetch on load + when filter/search changes
  useEffect(() => {
    fetchAdmissions();
  }, [fetchAdmissions]);

  // ✅ Status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateAdmissionStatus(token, id, { status: newStatus });
      fetchAdmissions();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  // ✅ Mark under review
  const handleMarkUnderReview = async (id, notes) => {
    try {
      await markAdmissionUnderReview(token, id, notes);
      alert('Admission marked as under review');
      fetchAdmissions();
    } catch (error) {
      alert('Failed to mark admission: ' + error.message);
    }
  };

  // ✅ Open modal
  const openCreateUserModal = (admission) => {
    setSelectedAdmission(admission);
    setShowCreateUserModal(true);
    setUserData({
      password: '',
      studentId: `STU${Date.now()}`,
      enrollmentNumber: `ENR${Date.now()}`,
    });
  };

  // ✅ Create user
  const handleCreateUser = async () => {
    if (!userData.password || userData.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      await createUserFromAdmission(token, selectedAdmission._id, userData);

      alert(`User account created successfully for ${selectedAdmission.email}!`);

      setShowCreateUserModal(false);
      setSelectedAdmission(null);
      fetchAdmissions();
    } catch (error) {
      alert('Failed to create user: ' + error.message);
    }
  };

  // ✅ Delete admission
  const handleDeleteAdmission = async (admissionId) => {
    if (window.confirm('Are you sure? This action cannot be undone.')) {
      try {
        await deleteAdmission(token, admissionId);
        alert('Admission deleted successfully');
        fetchAdmissions();
      } catch (error) {
        alert('Failed to delete admission: ' + error.message);
      }
    }
  };

  // ✅ Status colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved_by_master':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'user_created':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // ✅ Loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admissions Management</h1>

      {/* ✅ Admission Form */}
      <AdminAdmissionForm onAdmissionSubmit={fetchAdmissions} />

      {/* ✅ Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Search by name, email, phone..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Applications</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved_by_master">Approved by Master</option>
              <option value="rejected">Rejected</option>
              <option value="user_created">User Created</option>
            </select>
          </div>
        </div>
      </div>

      {/* ✅ Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs">Name</th>
                <th className="px-6 py-3 text-left text-xs">Email</th>
                <th className="px-6 py-3 text-left text-xs">Phone</th>
                <th className="px-6 py-3 text-left text-xs">Course</th>
                <th className="px-6 py-3 text-left text-xs">Status</th>
                <th className="px-6 py-3 text-left text-xs">Date</th>
                <th className="px-6 py-3 text-left text-xs">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {admissions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    No applications found
                  </td>
                </tr>
              ) : (
                admissions.map((admission) => (
                  <tr key={admission._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{admission.fullName}</td>
                    <td className="px-6 py-4">{admission.email}</td>
                    <td className="px-6 py-4">{admission.phone}</td>
                    <td className="px-6 py-4">{admission.course}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(admission.status)}`}>
                        {admission.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(admission.submittedAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 space-y-2">

                      {/* Pending */}
                      {admission.status === 'pending' && (
                        <button
                          onClick={() => handleMarkUnderReview(admission._id, '')}
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Mark Under Review
                        </button>
                      )}

                      {/* Approved → Create User */}
                      {admission.status === 'approved_by_master' && !admission.userCreated && (
                        <button
                          onClick={() => openCreateUserModal(admission)}
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Create User
                        </button>
                      )}

                      {/* User created */}
                      {admission.status === 'user_created' && (
                        <span className="text-gray-600 text-sm">User Created</span>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteAdmission(admission._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
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

      {/* ✅ Create User Modal */}
      {showCreateUserModal && selectedAdmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">

            <h2 className="text-xl font-bold mb-4">Create User Account</h2>

            <div className="mb-4">
              <p><strong>Name:</strong> {selectedAdmission.fullName}</p>
              <p><strong>Email:</strong> {selectedAdmission.email}</p>
              <p><strong>Course:</strong> {selectedAdmission.course}</p>
            </div>

            <div className="space-y-4">

              <div>
                <label>Password</label>
                <input
                  type="password"
                  value={userData.password}
                  onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label>Student ID</label>
                <input
                  type="text"
                  value={userData.studentId}
                  onChange={(e) => setUserData({ ...userData, studentId: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label>Enrollment Number</label>
                <input
                  type="text"
                  value={userData.enrollmentNumber}
                  onChange={(e) => setUserData({ ...userData, enrollmentNumber: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateUserModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateUser}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Create User
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
