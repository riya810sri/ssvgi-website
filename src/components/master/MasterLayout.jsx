import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function MasterLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/master/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/master/admissions', label: 'Approve Admissions', icon: '📝' },
    { path: '/master/students', label: 'All Students', icon: '👥' },
    { path: '/master/admins', label: 'Admin Management', icon: '⚙️' },
    { path: '/master/exam-results', label: 'Exam Results', icon: '📈' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">SSVGI Master Panel</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">
                Welcome, <strong>{user?.name}</strong> (Master)
              </span>
              <button
                onClick={handleLogout}
                className="bg-white text-purple-600 px-4 py-2 rounded hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md min-h-screen">
          <nav className="mt-8">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors ${
                  location.pathname === item.path
                    ? 'bg-purple-50 text-purple-600 border-r-4 border-purple-600'
                    : ''
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
