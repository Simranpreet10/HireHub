import React from 'react';
import { FaBriefcase, FaUser, FaBuilding, FaUsers, FaChartBar } from 'react-icons/fa';

const Sidebar = ({ currentView, setCurrentView }) => {
  const menuItems = [
    { id: 'jobs', label: 'Jobs', icon: FaBriefcase },
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'company', label: 'Company', icon: FaBuilding },
    { id: 'applicants', label: 'Applicants', icon: FaUsers },
    { id: 'statistics', label: 'Statistics', icon: FaChartBar },
  ];

  return (
    <div className="w-64 bg-white h-screen shadow-lg">
      <div className="p-4">
        <h1 className="text-xl font-bold">HireHub</h1>
      </div>
      
      <nav className="mt-8">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center p-4 ${
              currentView === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
            }`}
          >
            <item.icon className="mr-3" />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;