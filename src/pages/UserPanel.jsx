import React, { useEffect, useState } from 'react';
import { getCourses } from '../utils/api';
import UserEnrollmentCard from '../components/UserEnrollmentCard';

const STORAGE_KEY = 'user_enrollments_v1';

function readEnrollments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function writeEnrollments(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export default function UserPanel() {
  const [enrollments, setEnrollments] = useState(readEnrollments());
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [installments, setInstallments] = useState(3);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getCourses();
        setCourses(res.data || []);
      } catch (e) {
        console.error('Failed to fetch courses', e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const enrollSelected = () => {
    const course = courses.find(c => c._id === selectedCourse);
    if (!course) {
      alert('Select a course to enroll');
      return;
    }
    const newEnroll = {
      id: `ENR-${Date.now()}`,
      courseId: course._id,
      title: course.title,
      totalFee: Number((course.fee && course.fee.toString().replace(/[^0-9.]/g, '')) || 0),
      installments: Number(installments) || 3,
      paidInstallments: [],
      enrolledAt: new Date().toISOString(),
    };

    const updated = [newEnroll, ...enrollments];
    setEnrollments(updated);
    writeEnrollments(updated);
    setSelectedCourse('');
  };

  const updateEnrollment = (updated) => {
    const next = enrollments.map(e => (e.id === updated.id ? updated : e));
    setEnrollments(next);
    writeEnrollments(next);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <div className="text-sm text-gray-500 mt-1">Welcome to your student dashboard</div>
          </div>
          <div className="text-sm text-gray-600">{new Date().toLocaleString()}</div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-white rounded shadow">
                <div className="text-sm text-gray-500">Enrollments</div>
                <div className="text-xl font-bold">{enrollments.length}</div>
              </div>
              <div className="p-4 bg-white rounded shadow">
                <div className="text-sm text-gray-500">Payments Due</div>
                <div className="text-xl font-bold text-red-600">{enrollments.reduce((s,e)=> s + (Math.max(0, (Number(e.totalFee||0) - (e.paidInstallments||[]).reduce((a,b)=>a+Number(b.amount||0),0)))), 0)}</div>
              </div>
              <div className="p-4 bg-white rounded shadow">
                <div className="text-sm text-gray-500">Active Courses</div>
                <div className="text-xl font-bold text-blue-700">{enrollments.length}</div>
              </div>
              <div className="p-4 bg-white rounded shadow">
                <div className="text-sm text-gray-500">Receipts</div>
                <div className="text-xl font-bold">{enrollments.reduce((s,e)=> s + (e.paidInstallments ? e.paidInstallments.length : 0), 0)}</div>
              </div>
            </div>

            {/* Important Tasks */}
            <div className="bg-white rounded shadow mb-6">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-800">Important Tasks</h3>
                <div className="text-xs text-gray-500">Quick actions for your account</div>
              </div>
              <div className="p-4">
                <ul className="space-y-3">
                  <li className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">📝</div>
                      <div>
                        <div className="font-medium">View enrolled courses</div>
                        <div className="text-xs text-gray-500">See details of your enrollments and schedule</div>
                      </div>
                    </div>
                    <button className="text-sm px-3 py-1 border rounded text-blue-600">Open</button>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">💳</div>
                      <div>
                        <div className="font-medium">Pay pending installments</div>
                        <div className="text-xs text-gray-500">Complete your upcoming payments</div>
                      </div>
                    </div>
                    <button className="text-sm px-3 py-1 bg-green-600 text-white rounded">Pay Now</button>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">📄</div>
                      <div>
                        <div className="font-medium">Download receipts</div>
                        <div className="text-xs text-gray-500">Export your payment history</div>
                      </div>
                    </div>
                    <button className="text-sm px-3 py-1 border rounded">Export</button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Enrollments list */}
            <div className="space-y-4">
              {enrollments.length === 0 ? (
                <div className="p-6 bg-white rounded shadow text-center text-gray-500">You have no enrollments yet.</div>
              ) : (
                enrollments.map(en => (
                  <UserEnrollmentCard key={en.id} enrollment={en} onUpdate={updateEnrollment} />
                ))
              )}
            </div>
          </div>

          {/* Right column */}
          <aside className="space-y-6">
            <div className="bg-white rounded shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500">Current Plan</div>
                  <div className="font-semibold text-gray-800">Free Plan</div>
                </div>
                <button className="bg-green-600 text-white px-3 py-1 rounded">Upgrade</button>
              </div>
              <div className="text-xs text-gray-500 mt-3">Usage: 0/25</div>
            </div>

            <div className="bg-white rounded shadow p-4">
              <h4 className="font-semibold mb-3">Latest activity</h4>
              <div className="text-sm text-gray-500">No recent activity</div>
            </div>

            <div className="bg-white rounded shadow p-4">
              <h4 className="font-semibold mb-3">Support</h4>
              <div className="text-sm text-gray-500">Need help? Contact admin or visit help center.</div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
