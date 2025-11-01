import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../components/services/api";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
  });
  const nav = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        nav("/login");
        return;
      }

      API.setAuthToken(token);

      // Fetch user data from token or API
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (userData) {
        setUser(userData);
        
        // Fetch profile
        try {
          const profileRes = await API.raw.get(`/api/profile/${userData.user_id}`);
          setProfile(profileRes.data);
        } catch (err) {
          console.log("No profile found",err);
        }

        // Fetch applications
        try {
          const appsRes = await API.raw.get(`/api/applications/user/${userData.user_id}`);
          setApplications(appsRes.data || []);
          
          // Calculate stats
          const apps = appsRes.data || [];
          setStats({
            totalApplications: apps.length,
            pendingApplications: apps.filter(a => a.status.toLowerCase() === 'pending').length,
            acceptedApplications: apps.filter(a => a.status.toLowerCase() === 'accepted').length,
            rejectedApplications: apps.filter(a => a.status.toLowerCase() === 'rejected').length,
          });
        } catch (err) {
          console.log("No applications found",err);
        }

        // Fetch recent jobs
        try {
          const jobsRes = await API.raw.get("/api/viewjob");
          setRecentJobs((jobsRes.data || []).slice(0, 4));
        } catch (err) {
          console.log("Failed to fetch jobs",err);
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        nav("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    API.setAuthToken(null);
    
    // Trigger navbar update
    window.dispatchEvent(new Event('authChange'));
    
    nav("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome back, {user?.full_name}!</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Applications"
            value={stats.totalApplications}
            icon="📝"
            color="bg-blue-500"
          />
          <StatCard
            title="Pending"
            value={stats.pendingApplications}
            icon="⏳"
            color="bg-yellow-500"
          />
          <StatCard
            title="Accepted"
            value={stats.acceptedApplications}
            icon="✅"
            color="bg-green-500"
          />
          <StatCard
            title="Rejected"
            value={stats.rejectedApplications}
            icon="❌"
            color="bg-red-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">👤</span>
                Profile
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{user?.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mobile</p>
                  <p className="font-medium">{user?.mobile_no || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Work Status</p>
                  <p className="font-medium">{user?.work_status || "Not provided"}</p>
                </div>
                {profile?.location && (
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{profile.location}</p>
                  </div>
                )}
                {profile?.skills && (
                  <div>
                    <p className="text-sm text-gray-600">Skills</p>
                    <p className="font-medium text-sm">{profile.skills}</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => nav("/profile/setup")}
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
              >
                {profile ? "Edit Profile" : "Complete Profile"}
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">⚡</span>
                Quick Actions
              </h2>
              <div className="space-y-2">
                <button
                  onClick={() => nav("/jobs")}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition flex items-center"
                >
                  <span className="mr-3 text-xl">🔍</span>
                  <span className="font-medium">Browse Jobs</span>
                </button>
                <button
                  onClick={() => nav("/applications")}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition flex items-center"
                >
                  <span className="mr-3 text-xl">📋</span>
                  <span className="font-medium">My Applications</span>
                </button>
                <button
                  onClick={() => nav("/profile/setup")}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition flex items-center"
                >
                  <span className="mr-3 text-xl">⚙️</span>
                  <span className="font-medium">Settings</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Applications & Jobs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Applications */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <span className="mr-2">📄</span>
                  Recent Applications
                </h2>
                <button
                  onClick={() => nav("/applications")}
                  className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                >
                  View All →
                </button>
              </div>
              
              {applications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-4xl mb-2">📭</p>
                  <p>No applications yet</p>
                  <button
                    onClick={() => nav("/jobs")}
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition"
                  >
                    Browse Jobs
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 5).map((app) => (
                    <ApplicationCard key={app.application_id} application={app} />
                  ))}
                </div>
              )}
            </div>

            {/* Recommended Jobs */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <span className="mr-2">💼</span>
                  Recommended Jobs
                </h2>
                <button
                  onClick={() => nav("/jobs")}
                  className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                >
                  View All →
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentJobs.map((job) => (
                  <JobCard key={job.job_id} job={job} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Application Card Component
function ApplicationCard({ application }) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    shortlisted: "bg-blue-100 text-blue-800",
  };

  const status = application.status?.toLowerCase() || "pending";

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">
            {application.job?.job_title || "Job Position"}
          </h3>
          <p className="text-sm text-gray-600">
            {application.job?.company?.company_name || "Company Name"}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status] || statusColors.pending}`}>
          {application.status}
        </span>
      </div>
      <div className="flex items-center text-xs text-gray-500 space-x-4">
        <span>📅 Applied: {new Date(application.apply_date).toLocaleDateString()}</span>
        {application.job?.location && <span>📍 {application.job.location}</span>}
      </div>
    </div>
  );
}

// Job Card Component
function JobCard({ job }) {
  const nav = useNavigate();

  return (
    <div 
      className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
      onClick={() => nav(`/jobs/${job.job_id}`)}
    >
      <h3 className="font-semibold text-gray-900 mb-2">{job.job_title}</h3>
      <p className="text-sm text-gray-600 mb-3">
        {job.company?.company_name || "Company"}
      </p>
      <div className="space-y-1 text-xs text-gray-500">
        {job.location && <p>📍 {job.location}</p>}
        {job.ctc && <p>💰 ₹{job.ctc} LPA</p>}
        {job.employment_type && <p>💼 {job.employment_type}</p>}
      </div>
      <button className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm transition">
        View Details
      </button>
    </div>
  );
}