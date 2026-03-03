import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getAdmissionStats,
  getAlumniStats,
  getContactStats,
  getAdmissions
} from '../../utils/api';

export default function Dashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    admissions: { total: 0, pending: 0, approved: 0 },
    alumni: { total: 0, verified: 0 },
    contacts: { total: 0, new: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get main stats
        const [admissionsData, alumniData, contactsData] = await Promise.all([
          getAdmissionStats(token),
          getAlumniStats(token),
          getContactStats(token)
        ]);

        // Get main stats and approved applications count separately for accuracy
        const approvedAdmissionsRes = await getAdmissions(token, { status: 'approved_by_master' });
        
        // Calculate the count of applications approved by master (that would be the approved applications)
        const approvedCount = approvedAdmissionsRes.data ? approvedAdmissionsRes.data.length : 0;

        setStats({
          admissions: {
            ...admissionsData.data,
            approved: approvedCount // Use actual approved applications count
          },
          alumni: alumniData.data || { total: 0, verified: 0, mentors: 0 },
          contacts: contactsData.data || { total: 0, new: 0, replied: 0 }
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Applications"
          value={stats.admissions.total}
          subtitle={`${stats.admissions.pending} pending`}
          icon="📝"
          color="border-blue-500"
        />
        <StatCard
          title="Total Alumni"
          value={stats.alumni.total}
          subtitle={`${stats.alumni.verified} verified`}
          icon="🎓"
          color="border-purple-500"
        />
        <StatCard
          title="Contact Messages"
          value={stats.contacts.total}
          subtitle={`${stats.contacts.new} new`}
          icon="📧"
          color="border-green-500"
        />
        <StatCard
          title="Approved Applications"
          value={stats.admissions.approved || 0}
          icon="✅"
          color="border-green-500"
        />
        <StatCard
          title="Alumni Mentors"
          value={stats.alumni.mentors || 0}
          icon="👨‍🏫"
          color="border-yellow-500"
        />
        <StatCard
          title="Replied Messages"
          value={stats.contacts.replied || 0}
          icon="💬"
          color="border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/admin/admissions"
              className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">📝</span>
                <div>
                  <p className="font-semibold text-gray-800">Review Applications</p>
                  <p className="text-sm text-gray-600">Manage pending admission requests</p>
                </div>
              </div>
            </a>
            <a
              href="/admin/contacts"
              className="block p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">📧</span>
                <div>
                  <p className="font-semibold text-gray-800">Check Messages</p>
                  <p className="text-sm text-gray-600">Respond to contact inquiries</p>
                </div>
              </div>
            </a>
            <a
              href="/admin/courses"
              className="block p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">📚</span>
                <div>
                  <p className="font-semibold text-gray-800">Manage Courses</p>
                  <p className="text-sm text-gray-600">Update course information</p>
                </div>
              </div>
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
              <div>
                <p className="text-gray-800">New application received</p>
                <p className="text-gray-500 text-xs">Just now</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
              <div>
                <p className="text-gray-800">Alumni registration verified</p>
                <p className="text-gray-500 text-xs">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3"></div>
              <div>
                <p className="text-gray-800">Contact message replied</p>
                <p className="text-gray-500 text-xs">5 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
