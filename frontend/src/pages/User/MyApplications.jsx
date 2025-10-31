import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../components/services/api";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, accepted, rejected
  const nav = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        nav("/login");
        return;
      }

      API.setAuthToken(token);
      const userData = JSON.parse(localStorage.getItem("userData"));
      
      if (!userData) {
        nav("/login");
        return;
      }

      const response = await API.raw.get(`/api/applications/user/${userData.user_id}`);
      setApplications(response.data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      if (error.response?.status === 401) {
        nav("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === "all") return true;
    return app.status?.toLowerCase() === filter;
  });

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    applied: "bg-blue-100 text-blue-800 border-blue-300",
    accepted: "bg-green-100 text-green-800 border-green-300",
    rejected: "bg-red-100 text-red-800 border-red-300",
    shortlisted: "bg-purple-100 text-purple-800 border-purple-300",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <button
              onClick={() => nav("/user-dashboard")}
              className="text-blue-600 hover:text-blue-800 flex items-center mb-2"
            >
              <span className="mr-2">←</span> Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
            <p className="text-gray-600 mt-1">
              Track all your job applications in one place
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mt-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            All ({applications.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === "pending"
                ? "bg-yellow-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Pending ({applications.filter(a => a.status?.toLowerCase() === "pending").length})
          </button>
          <button
            onClick={() => setFilter("applied")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === "applied"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Applied ({applications.filter(a => a.status?.toLowerCase() === "applied").length})
          </button>
          <button
            onClick={() => setFilter("accepted")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === "accepted"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Accepted ({applications.filter(a => a.status?.toLowerCase() === "accepted").length})
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === "rejected"
                ? "bg-red-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Rejected ({applications.filter(a => a.status?.toLowerCase() === "rejected").length})
          </button>
        </div>
      </div>

      {/* Applications List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-6xl mb-4">📭</p>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Applications Found
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === "all"
                ? "You haven't applied to any jobs yet."
                : `You don't have any ${filter} applications.`}
            </p>
            <button
              onClick={() => nav("/jobs")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <ApplicationCard
                key={application.application_id}
                application={application}
                statusColors={statusColors}
                onViewJob={(jobId) => nav(`/jobs/${jobId}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ApplicationCard({ application, statusColors, onViewJob }) {
  const status = application.status?.toLowerCase() || "pending";
  const job = application.job || {};
  const company = job.company || {};

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Left Section - Job Info */}
        <div className="flex-1 mb-4 md:mb-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {job.job_title || "Job Position"}
              </h3>
              <p className="text-gray-600 font-medium">
                {company.company_name || "Company Name"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
            {job.location && (
              <span className="flex items-center">
                <span className="mr-1">📍</span>
                {job.location}
              </span>
            )}
            {job.ctc && (
              <span className="flex items-center">
                <span className="mr-1">💰</span>
                ₹{job.ctc} LPA
              </span>
            )}
            {job.employment_type && (
              <span className="flex items-center">
                <span className="mr-1">💼</span>
                {job.employment_type}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-500">
            <span>
              📅 Applied: {new Date(application.apply_date).toLocaleDateString()}
            </span>
            <span>
              🔄 Updated: {new Date(application.last_updated).toLocaleDateString()}
            </span>
            {application.resume && (
              <a
                href={application.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                📄 View Resume
              </a>
            )}
          </div>
        </div>

        {/* Right Section - Status & Actions */}
        <div className="flex flex-col items-end space-y-3">
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold border ${
              statusColors[status] || statusColors.pending
            }`}
          >
            {application.status}
          </span>
          <button
            onClick={() => onViewJob(job.job_id)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Job Details →
          </button>
        </div>
      </div>
    </div>
  );
}
