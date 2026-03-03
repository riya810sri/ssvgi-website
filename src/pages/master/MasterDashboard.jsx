import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getMasterDashboardStats,
  getRecentActivities,
  getAllAdmins,
  updateAdminStatus,
} from '../../utils/api';

export default function MasterDashboard() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, activitiesData, adminsData] = await Promise.all([
        getMasterDashboardStats(token),
        getRecentActivities(token),
        getAllAdmins(token),
      ]);

      setStats(statsData.data);
      setActivities(activitiesData.data);
      setAdmins(adminsData.data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdminStatus = async (adminId, currentStatus) => {
    try {
      await updateAdminStatus(token, adminId, !currentStatus);
      await fetchDashboardData();
    } catch (err) {
      alert('Failed to update admin status: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading Master Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Master Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome, {user?.name} (Master)</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Students Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Students</h3>
          <p className="text-3xl font-bold text-blue-600">{stats?.students?.total || 0}</p>
          <p className="text-sm text-gray-600 mt-2">
            Active: {stats?.students?.active || 0} | Inactive: {stats?.students?.inactive || 0}
          </p>
        </div>

        {/* Admissions Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Admissions</h3>
          <p className="text-3xl font-bold text-purple-600">{stats?.admissions?.total || 0}</p>
          <p className="text-sm text-gray-600 mt-2">
            Pending: {stats?.admissions?.pending || 0} | Under Review: {stats?.admissions?.underReview || 0}
          </p>
        </div>

        {/* Admins Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Admin Staff</h3>
          <p className="text-3xl font-bold text-green-600">{stats?.admins?.total || 0}</p>
          <p className="text-sm text-gray-600 mt-2">Active: {stats?.admins?.active || 0}</p>
        </div>

        {/* Courses Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Courses</h3>
          <p className="text-3xl font-bold text-orange-600">{stats?.courses?.total || 0}</p>
          <p className="text-sm text-gray-600 mt-2">
            Enrollments: {stats?.enrollments?.active || 0}
          </p>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Admission Workflow Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Admission Workflow Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Pending</span>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                {stats?.admissions?.pending || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Under Review (Admin)</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {stats?.admissions?.underReview || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Approved by Master</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {stats?.admissions?.approved || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Rejected</span>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                {stats?.admissions?.rejected || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">User Created</span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                {stats?.admissions?.userCreated || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Admin Management */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Admin Management</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {admins.map((admin) => (
              <div
                key={admin._id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded"
              >
                <div>
                  <p className="font-medium text-gray-900">{admin.name}</p>
                  <p className="text-sm text-gray-600">{admin.email}</p>
                  <p className="text-xs text-gray-500">
                    {admin.role === 'master' ? 'Master' : 'Admin'}
                  </p>
                </div>
                <button
                  onClick={() => handleToggleAdminStatus(admin._id, admin.isActive)}
                  disabled={admin.role === 'master'}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    admin.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  } ${admin.role === 'master' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {admin.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recent Admissions */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Admissions</h4>
            <div className="space-y-2">
              {activities?.recentAdmissions?.slice(0, 5).map((admission) => (
                <div key={admission._id} className="text-sm">
                  <p className="font-medium text-gray-900">{admission.fullName}</p>
                  <p className="text-xs text-gray-600">{admission.email}</p>
                  <p className="text-xs text-gray-500">
                    Status: {admission.status.replace(/_/g, ' ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Users */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Students</h4>
            <div className="space-y-2">
              {activities?.recentUsers?.slice(0, 5).map((student) => (
                <div key={student._id} className="text-sm">
                  <p className="font-medium text-gray-900">{student.name}</p>
                  <p className="text-xs text-gray-600">{student.email}</p>
                  <p className="text-xs text-gray-500">ID: {student.studentId}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Enrollments */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Enrollments</h4>
            <div className="space-y-2">
              {activities?.recentEnrollments?.slice(0, 5).map((enrollment) => (
                <div key={enrollment._id} className="text-sm">
                  <p className="font-medium text-gray-900">
                    {enrollment.userId?.name || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {enrollment.courseId?.name || 'Unknown Course'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
