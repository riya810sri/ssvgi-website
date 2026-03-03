import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UserLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout('user'); // Only log out user, not admin
    navigate('/login');
  };

  const nav = [
    { name: 'Dashboard', path: '/user', icon: '🏠' },
    { name: 'Exams', path: '/user/exams', icon: '📝' },
    { name: 'Payments', path: '/user/payments', icon: '💳' },
    { name: 'Receipts', path: '/user/receipts', icon: '📄' },
    { name: 'Candidates', path: '/user/candidates', icon: '👥' },
    { name: 'Questions', path: '/user/questions', icon: '❓' },
    { name: 'Statistics', path: '/user/statistics', icon: '�' },
    { name: 'Notifications', path: '/user/notifications', icon: '�' },
    { name: 'Settings', path: '/user/settings', icon: '⚙️' },
    { name: 'Help & Support', path: '/user/help', icon: '🧰' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Thin top bar */}
      <div className="bg-teal-600 text-white text-sm py-2">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div>SSVGI Student Panel</div>
          <div>{new Date().toLocaleString()}</div>
        </div>
      </div>

      <div className="flex">
        {/* Dark Sidebar */}
        <aside className={`${sidebarOpen ? 'w-56' : 'w-20'} bg-gray-800 text-gray-200 min-h-screen transition-all`}> 
          <div className="px-4 py-5 flex items-center justify-between border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="bg-teal-500 rounded-full h-8 w-8 flex items-center justify-center font-bold">S</div>
              {sidebarOpen && <div className="text-sm font-semibold">Student</div>}
            </div>
            <button onClick={() => setSidebarOpen(s => !s)} className="text-gray-300">{sidebarOpen ? '‹' : '›'}</button>
          </div>

          <nav className="mt-4 px-2">
            {nav.map(item => {
              const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              return (
                <Link key={item.name} to={item.path} className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg mb-2 transition-colors ${active ? 'bg-teal-500 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                  <span className="text-2xl">{item.icon}</span>
                  {sidebarOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto p-4 border-t border-gray-700">
            <div className="text-xs text-gray-400">Logged in as</div>
            <div className="text-sm font-medium">{user?.name || 'Guest'}</div>
            <button onClick={handleLogout} className="mt-3 w-full text-left text-red-400 hover:text-red-300">Sign out</button>
          </div>
        </aside>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
