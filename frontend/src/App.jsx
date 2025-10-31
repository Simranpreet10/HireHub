// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

// UI Components
import Navbar from "./components/ui/Navbar";
import Footer from "./components/ui/Footer";

// General Pages
import Home from "./pages/Home";

// Auth Pages
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

// User Pages
import UserDashboard from "./pages/User/UserDashboard";
import ProfileSetup from "./pages/User/ProfileSetup";
import MyApplications from "./pages/User/MyApplications";
import JobSearch from "./pages/User/JobSearch";

// Job Pages
import JobsList from "./pages/Jobs/JobsList";
import JobDetail from "./pages/Jobs/JobDetail";

// Admin Pages
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminUsers from "./pages/Admin/Users";
import AdminJobs from "./pages/Admin/Jobs";
import Recruiter from "./pages/Admin/Recruiter";

/** Optional: simple admin auth guard (JWT in localStorage named 'adminToken') */
function RequireAdmin({ children }) {
  const token = localStorage.getItem("adminToken");
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}

function AppContent() {
  const location = useLocation();
  // hide navbar/footer for admin routes
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      {!isAdminRoute && <Navbar />}

      <main className="flex-grow container mx-auto px-4 py-6">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* User Dashboard */}
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/profile/setup" element={<ProfileSetup />} />
          <Route path="/applications" element={<MyApplications />} />
          <Route path="/job-search" element={<JobSearch />} />

          {/* Jobs */}
          <Route path="/jobs" element={<JobSearch />} />
          <Route path="/jobs/:id" element={<JobDetail />} />

          {/* Admin login (kept outside layout) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Nested admin routes (use relative child paths) */}
          <Route
            path="/admin/*"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            {/* NOTE: child paths are relative (no leading slash) */}
            <Route index element={<AdminDashboard />} />       {/* /admin */}
            <Route path="dashboard" element={<AdminDashboard />} /> {/* /admin/dashboard */}
            <Route path="users" element={<AdminUsers />} />           {/* /admin/users */}
            <Route path="jobs" element={<AdminJobs />} />             {/* /admin/jobs */}
            <Route path="recruiter" element={<Recruiter />} />        {/* /admin/recruiter */}
            {/* add more nested admin routes here */}
          </Route>

          {/* 404 */}
          <Route
            path="*"
            element={
              <h2 className="text-center text-2xl mt-10">404 - Page Not Found</h2>
            }
          />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
