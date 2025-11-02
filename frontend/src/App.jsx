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
import UserProfile from "./pages/Admin/UserProfile";
import AdminApplications from "./pages/Admin/Applications"; 

// Recruiter Pages
import RecruiterDashboard from "./pages/Recruiter/Dashboard";
import JobManager from "./pages/Recruiter/JobManager";
import JobForm from "./pages/Recruiter/JobForm";
import RecruiterProfile from "./pages/Recruiter/RecruiterProfile";
import CompanyProfile from "./pages/Recruiter/CompanyProfile";
import ApplicantsView from "./pages/Recruiter/ApplicantsManager";
// import JobsWithApplicants from "./pages/Recruiter/JobsWithApplicants";

/** Admin Auth Guard */
function RequireAdmin({ children }) {
  const token = localStorage.getItem("adminToken");
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}

function AppContent() {
  const location = useLocation();
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

          {/* Recruiter Dashboard */}
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="/recruiter/jobs" element={<JobManager />} />
          <Route path="/recruiter/jobs/new" element={<JobForm />} />
          <Route path="/recruiter/profile" element={<RecruiterProfile />} />
          <Route path="/recruiter/company" element={<CompanyProfile />} />
          <Route path="/recruiter/applicants" element={<ApplicantsView />} />
          {/* <Route path="/recruiter/jobs-with-applicants" element={<JobsWithApplicants />} /> */}

          {/* Admin login (outside layout) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Nested admin routes */}
          <Route
            path="/admin/*"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/:userId/profile" element={<UserProfile />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="recruiter" element={<Recruiter />} />
            <Route path="applications" element={<AdminApplications />} /> {/* ✅ Added route */}
          </Route>

          {/* 404 Page */}
          <Route
            path="*"
            element={
              <h2 className="text-center text-2xl mt-10">
                404 - Page Not Found
              </h2>
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
