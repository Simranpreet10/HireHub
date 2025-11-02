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
import RecruiterLogin from "./pages/Auth/RecruiterLogin";
import RecruiterSignup from "./pages/Auth/RecruiterSignup";

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

//Recruiter Pages
import RecruiterLayout from "./pages/Recruiter/RecruiterLayout";
import RecruiterDashboard from "./pages/Recruiter/Dashboard";
import JobManager from "./pages/Recruiter/JobManager";
import JobForm from "./pages/Recruiter/JobForm";
import RecruiterProfile from "./pages/Recruiter/RecruiterProfile";
import CompanyProfile from "./pages/Recruiter/CompanyProfile";
import ApplicantsView from "./pages/Recruiter/ApplicantsManager";
// import JobsWithApplicants from "./pages/Recruiter/JobsWithApplicants";

/** Authentication Guards */
function RequireAdmin({ children }) {
  const token = localStorage.getItem("adminToken");
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}

function RequireUser({ children }) {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("userData");
  
  if (!token || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access this page</p>
          <Navigate to="/login" replace />
        </div>
      </div>
    );
  }
  return children;
}

function RequireRecruiter({ children }) {
  const token = localStorage.getItem("recruiterToken");
  const recruiterData = localStorage.getItem("recruiterData");
  
  if (!token || !recruiterData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Recruiter Login Required</h2>
          <p className="text-gray-600 mb-6">Please log in as a recruiter to access this page</p>
          <Navigate to="/recruiter/login" replace />
        </div>
      </div>
    );
  }
  return children;
}

function AppContent() {
  const location = useLocation();
  // hide navbar/footer for admin and recruiter routes
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isRecruiterRoute = location.pathname.startsWith("/recruiter") && !location.pathname.includes("/login") && !location.pathname.includes("/signup");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      {!isAdminRoute && !isRecruiterRoute && <Navbar />}

      <main className={`flex-grow ${!isAdminRoute && !isRecruiterRoute ? 'container mx-auto px-4 py-6' : ''}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Recruiter Auth */}
          <Route path="/recruiter/login" element={<RecruiterLogin />} />
          <Route path="/recruiter/signup" element={<RecruiterSignup />} />

          {/* Protected User Routes */}
          <Route path="/user-dashboard" element={<RequireUser><UserDashboard /></RequireUser>} />
          <Route path="/profile/setup" element={<RequireUser><ProfileSetup /></RequireUser>} />
          <Route path="/applications" element={<RequireUser><MyApplications /></RequireUser>} />
          <Route path="/job-search" element={<RequireUser><JobSearch /></RequireUser>} />

          {/* Protected Job Routes */}
          <Route path="/jobs" element={<RequireUser><JobSearch /></RequireUser>} />
          <Route path="/jobs/:id" element={<RequireUser><JobDetail /></RequireUser>} />

          {/* Protected Recruiter Routes with Layout */}
          <Route path="/recruiter/*" element={<RequireRecruiter><RecruiterLayout /></RequireRecruiter>}>
            <Route path="dashboard" element={<RecruiterDashboard />} />
            <Route path="jobs" element={<JobManager />} />
            <Route path="jobs/new" element={<JobForm />} />
            <Route path="profile" element={<RecruiterProfile />} />
            <Route path="company" element={<CompanyProfile />} />
            <Route path="applicants" element={<ApplicantsView />} />
          </Route>

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
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            
            <Route path="users/:userId/profile" element={<UserProfile />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="recruiter" element={<Recruiter />} />
          </Route>

          {/* 404 */}
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

      {!isAdminRoute && !isRecruiterRoute && <Footer />}
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
