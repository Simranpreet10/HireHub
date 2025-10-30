// src/layouts/AdminLayout.jsx
import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Users, Briefcase, LayoutDashboard } from "lucide-react";

export default function AdminLayout() {
  const nav = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    alert("Logged out successfully");
    nav("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-700 text-white flex flex-col p-4 space-y-6">
        <h1 className="text-2xl font-bold text-center">Admin Panel</h1>

        <nav className="flex flex-col space-y-3">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-md ${
                isActive ? "bg-indigo-900" : "hover:bg-indigo-800"
              }`
            }
          >
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-md ${
                isActive ? "bg-indigo-900" : "hover:bg-indigo-800"
              }`
            }
          >
            <Users size={18} /> Users
          </NavLink>


               <NavLink
            to="/admin/recruiter"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-md ${
                isActive ? "bg-indigo-900" : "hover:bg-indigo-800"
              }`
            }
          >
            <Briefcase size={18} /> Recruiter
          </NavLink>
        
          <NavLink
            to="/admin/jobs"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-md ${
                isActive ? "bg-indigo-900" : "hover:bg-indigo-800"
              }`
            }
          >
            <Briefcase size={18} /> Jobs
          </NavLink>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 p-2 rounded-md"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6">
        <Outlet />
      </main>
    </div>
  );
}
