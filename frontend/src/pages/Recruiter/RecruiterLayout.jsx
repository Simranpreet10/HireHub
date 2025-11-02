import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

export default function RecruiterLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: '📊',
      path: '/recruiter/dashboard'
    },
    { 
      id: 'jobs', 
      label: 'Manage Jobs', 
      icon: '💼',
      path: '/recruiter/jobs'
    },
    { 
      id: 'new-job', 
      label: 'Post New Job', 
      icon: '✨',
      path: '/recruiter/jobs/new'
    },
    { 
      id: 'applicants', 
      label: 'Applicants', 
      icon: '👥',
      path: '/recruiter/applicants'
    },
    { 
      id: 'company', 
      label: 'Company Profile', 
      icon: '🏢',
      path: '/recruiter/company'
    },
    { 
      id: 'profile', 
      label: 'My Profile', 
      icon: '👤',
      path: '/recruiter/profile'
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('recruiterToken');
    localStorage.removeItem('recruiterData');
    navigate('/recruiter/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        {/* Logo/Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <div>
                <h1 className="text-xl font-bold text-blue-600">HireHub</h1>
                <p className="text-xs text-gray-500">Recruiter Portal</p>
              </div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              {isSidebarOpen ? '◀' : '▶'}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center p-3 rounded-lg transition ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  title={!isSidebarOpen ? item.label : ''}
                >
                  <span className="text-xl">{item.icon}</span>
                  {isSidebarOpen && (
                    <span className="ml-3">{item.label}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-3 rounded-lg text-red-600 hover:bg-red-50 transition"
            title={!isSidebarOpen ? 'Logout' : ''}
          >
            <span className="text-xl">🚪</span>
            {isSidebarOpen && (
              <span className="ml-3 font-medium">Logout</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
