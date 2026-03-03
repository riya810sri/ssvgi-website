import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminAdmissionForm from '../../components/admin/AdminAdmissionForm';
import { getAdmissions, approveAdmission, rejectAdmission } from '../../utils/api';

export default function MasterAdmissions() {
  const { token } = useAuth();
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('under_review');
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [masterNotes, setMasterNotes] = useState('');
  const [actionType, setActionType] = useState(null);

  useEffect(() => {
    fetchAdmissions();
  }, [filter]);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const response = await getAdmissions(token, { status: filter });
      setAdmissions(response.data);
    } catch (error) {
      console.error('Error fetching admissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedAdmission) return;

    try {
      await approveAdmission(token, selectedAdmission._id, masterNotes);
      alert('Admission approved successfully!');
      setSelectedAdmission(null);
      setMasterNotes('');
      fetchAdmissions();
    } catch (error) {
      alert('Failed to approve admission: ' + error.message);
    }
  };

  const handleReject = async () => {
    if (!selectedAdmission) return;

    try {
      await rejectAdmission(token, selectedAdmission._id, masterNotes);
      alert('Admission rejected successfully!');
      setSelectedAdmission(null);
      setMasterNotes('');
      fetchAdmissions();
    } catch (error) {
      alert('Failed to reject admission: ' + error.message);
    }
  };

  const openActionModal = (admission, type) => {
    setSelectedAdmission(admission);
    setActionType(type);
    setMasterNotes('');
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Master Admission Approvals</h1>
      
      {/* Admin Admission Form */}
      <AdminAdmissionForm onAdmissionSubmit={fetchAdmissions} />
      
      {/* Filter Tabs */}
      <div className="mb-6 flex gap-4 border-b">
        {['pending', 'under_review', 'approved_by_master', 'rejected', 'user_created'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`pb-3 px-4 font-medium ${
              filter === status
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {status.replace(/_/g, ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Admin Notes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admissions.map((admission) => (
                <tr key={admission._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {admission.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {admission.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {admission.course}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        admission.status === 'approved_by_master'
                          ? 'bg-green-100 text-green-800'
                          : admission.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : admission.status === 'under_review'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {admission.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {admission.adminNotes || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {admission.status === 'under_review' || admission.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => openActionModal(admission, 'approve')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => openActionModal(admission, 'reject')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {admissions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No admissions found with status: {filter.replace(/_/g, ' ')}
            </div>
          )}
        </div>
      )}

      {/* Action Modal */}
      {selectedAdmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              {actionType === 'approve' ? 'Approve' : 'Reject'} Admission
            </h2>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Name:</strong> {selectedAdmission.fullName}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Email:</strong> {selectedAdmission.email}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Course:</strong> {selectedAdmission.course}
              </p>
              {selectedAdmission.adminNotes && (
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Admin Notes:</strong> {selectedAdmission.adminNotes}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Master Notes (Optional)
              </label>
              <textarea
                value={masterNotes}
                onChange={(e) => setMasterNotes(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 h-24"
                placeholder="Add your notes here..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedAdmission(null);
                  setMasterNotes('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={actionType === 'approve' ? handleApprove : handleReject}
                className={`px-4 py-2 rounded text-white ${
                  actionType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionType === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
