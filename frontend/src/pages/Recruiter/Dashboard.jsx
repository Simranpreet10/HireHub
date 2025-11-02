import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../components/services/api";

export default function RecruiterDashboard() {
  const [recruiter, setRecruiter] = useState(null);
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplicants: 0,
    expiredApplications: 0,
  });
  const nav = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("recruiterToken");
      
      if (!token) {
        nav("/login");
        return;
      }

      API.setAuthToken(token);

      // Fetch recruiter data
      const recruiterData = JSON.parse(localStorage.getItem("recruiterData"));
      if (recruiterData) {
        setRecruiter(recruiterData);
        
        // Fetch company profile
        if (recruiterData.company_id) {
          try {
            const companyRes = await API.raw.get(`/api/updatecompany/company/${recruiterData.company_id}`);
            setCompany(companyRes.data);
          } catch (err) {
            console.log("No company profile found", err);
          }
        }

        // Fetch jobs
        if (recruiterData.recruiter_id) {
          try {
            const jobsRes = await API.raw.get(`/api/getRecruiterJobs/recruiter/${recruiterData.recruiter_id}/jobs`);
            const jobsData = jobsRes.data || [];
            setJobs(jobsData);
            
            // Calculate stats - A job is active if closing_date is in the future or not set
            const now = new Date();
            const activeJobs = jobsData.filter(job => {
              if (!job.closing_date) return true; // No closing date means always active
              return new Date(job.closing_date) > now;
            });
            
            setStats(prev => ({
              ...prev,
              totalJobs: jobsData.length,
              activeJobs: activeJobs.length
            }));
          } catch (err) {
            console.log("Failed to fetch jobs", err);
          }
        }

        // Fetch applications via job tracking
        try {
          const jobTrackRes = await API.raw.get("/api/job_track/jobs");
          const allJobs = jobTrackRes.data || [];
          
          // Extract all applications from all jobs
          const allApps = [];
          allJobs.forEach(job => {
            if (job.applications && job.applications.length > 0) {
              job.applications.forEach(app => {
                allApps.push({
                  ...app,
                  job: { job_title: job.job_title, job_id: job.job_id }
                });
              });
            }
          });
          
          // Sort by most recent
          const sortedApps = allApps.sort((a, b) => 
            new Date(b.apply_date) - new Date(a.apply_date)
          );
          
          setApplications(sortedApps);
          
          // Calculate expired applications (applications for jobs past closing date)
          const now = new Date();
          const expiredApps = allApps.filter(app => {
            // Find the job for this application
            const jobForApp = allJobs.find(j => j.job_id === app.job_id);
            if (!jobForApp || !jobForApp.closing_date) return false;
            return new Date(jobForApp.closing_date) < now;
          });
          
          // Update stats
          setStats(prev => ({
            ...prev,
            totalApplicants: allApps.length,
            expiredApplications: expiredApps.length
          }));
        } catch (err) {
          console.log("Failed to fetch applications", err);
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("recruiterToken");
        localStorage.removeItem("recruiterData");
        nav("/login");
      }
    } finally {
      setLoading(false);
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
            <p className="text-sm text-gray-600">
              {company?.company_name ? `${recruiter?.name} • ${company.company_name}` : recruiter?.name}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Jobs Posted"
            value={stats.totalJobs}
            icon="💼"
            color="bg-blue-500"
            onClick={() => stats.totalJobs > 0 && nav('/recruiter/jobs')}
          />
          <StatCard
            title="Active Jobs"
            value={stats.activeJobs}
            icon="🟢"
            color="bg-green-500"
            onClick={() => stats.activeJobs > 0 && nav('/recruiter/jobs')}
          />
          <StatCard
            title="Total Applicants"
            value={stats.totalApplicants}
            icon="👥"
            color="bg-purple-500"
            onClick={() => stats.totalApplicants > 0 && nav('/recruiter/applicants')}
          />
          <StatCard
            title="Expired Applications"
            value={stats.expiredApplications}
            icon="⏰"
            color="bg-orange-500"
            onClick={() => stats.expiredApplications > 0 && nav('/recruiter/applicants')}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profiles & Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Recruiter Profile Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">👤</span>
                Recruiter Profile
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{recruiter?.full_name || recruiter?.name || "Not set"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{recruiter?.email || "Not set"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium">{recruiter?.is_active ? "Active" : "Inactive"}</p>
                </div>
              </div>
              <button
                onClick={() => nav("/recruiter/profile")}
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
              >
                Edit Profile
              </button>
            </div>

            {/* Company Profile Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">🏢</span>
                Company Profile
              </h2>
              <div className="space-y-3">
                {company ? (
                  <>
                    <div>
                      <p className="text-sm text-gray-600">Company Name</p>
                      <p className="font-medium">{company.company_name || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Industry</p>
                      <p className="font-medium">{company.industry_type || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium">{company.location || "Not set"}</p>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500">Complete your company profile</p>
                )}
              </div>
              <button
                onClick={() => nav("/recruiter/company")}
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
              >
                {company ? "Edit Company Profile" : "Add Company Profile"}
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
                  onClick={() => nav("/recruiter/jobs/new")}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition flex items-center"
                >
                  <span className="mr-3 text-xl">✨</span>
                  <span className="font-medium">Post New Job</span>
                </button>
                <button
                  onClick={() => nav("/recruiter/jobs")}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition flex items-center"
                >
                  <span className="mr-3 text-xl">📊</span>
                  <span className="font-medium">Manage Jobs</span>
                </button>
                <button
                  onClick={() => nav("/recruiter/applicants")}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition flex items-center"
                >
                  <span className="mr-3 text-xl">👥</span>
                  <span className="font-medium">Review Applications</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Jobs & Applications */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Jobs */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <span className="mr-2">💼</span>
                  Recent Jobs
                </h2>
                <button
                  onClick={() => nav("/recruiter/jobs")}
                  className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                >
                  View All →
                </button>
              </div>
              
              {jobs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-4xl mb-2">📝</p>
                  <p>No jobs posted yet</p>
                  <button
                    onClick={() => nav("/recruiter/jobs/new")}
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition"
                  >
                    Post Your First Job
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.slice(0, 3).map(job => (
                    <RecruiterJobCard key={job.job_id} job={job} />
                  ))}
                </div>
              )}
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <span className="mr-2">📄</span>
                  Recent Applications
                </h2>
                <button
                  onClick={() => nav("/recruiter/applicants")}
                  className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                >
                  View All →
                </button>
              </div>
              
              {applications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-4xl mb-2">📭</p>
                  <p>No applications yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 5).map(app => (
                    <ApplicationCard key={app.application_id} application={app} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatCard({ title, value, icon, color, onClick }) {
  const isClickable = onClick && value > 0;
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 transition ${
        isClickable ? 'cursor-pointer hover:shadow-lg hover:scale-105 transform' : ''
      }`}
      onClick={isClickable ? onClick : undefined}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {isClickable && (
            <p className="text-xs text-blue-600 mt-2">Click to view →</p>
          )}
        </div>
        <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function RecruiterJobCard({ job }) {
  const nav = useNavigate();
  
  // Check if job is active or expired
  const isActive = () => {
    if (!job.closing_date) return true;
    return new Date(job.closing_date) > new Date();
  };
  
  // Format date properly
  const getPostedDate = () => {
    const dateField = job.posted_date || job.created_at || job.date_posted;
    if (!dateField) return 'Recently';
    try {
      return new Date(dateField).toLocaleDateString();
    } catch {
      return 'Recently';
    }
  };
  
  // Format closing date
  const getClosingDate = () => {
    if (!job.closing_date) return 'No deadline';
    try {
      return new Date(job.closing_date).toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  };
  
  const jobActive = isActive();
  
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{job.job_title}</h3>
          <p className="text-sm text-gray-600">{job.location || 'Location not specified'}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
          jobActive ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
        }`}>
          {jobActive ? '✓ Active' : '⏰ Expired'}
        </span>
      </div>
      <div className="space-y-1 mb-3">
        <div className="flex items-center text-xs text-gray-500">
          <span>📅 Posted: {getPostedDate()}</span>
          <span className="mx-2">•</span>
          <span>👥 {job.applications_count || job._count?.applications || 0} Applications</span>
        </div>
        <div className="text-xs text-gray-500">
          <span>🎯 Closes: {getClosingDate()}</span>
        </div>
      </div>
      <div className="space-y-2">
        <button 
          onClick={() => nav('/recruiter/jobs')}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm transition"
        >
          View in Job Manager
        </button>
      </div>
    </div>
  );
}

function ApplicationCard({ application }) {
  const nav = useNavigate();
  
  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800",
    APPLIED: "bg-blue-100 text-blue-800",
    REVIEWING: "bg-blue-100 text-blue-800",
    SHORTLISTED: "bg-green-100 text-green-800",
    ACCEPTED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{application.user?.full_name || 'Applicant'}</h3>
          <p className="text-sm text-gray-600 mt-1">{application.job?.job_title || 'Job Title'}</p>
          {application.user?.email && (
            <p className="text-xs text-gray-500 mt-1">📧 {application.user.email}</p>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
          statusColors[application.status] || statusColors.PENDING
        }`}>
          {application.status || 'PENDING'}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <span>📅 Applied: {application.apply_date ? new Date(application.apply_date).toLocaleDateString() : 'N/A'}</span>
        {application.resume && (
          <a 
            href={application.resume} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600"
            onClick={(e) => e.stopPropagation()}
          >
            📄 Resume
          </a>
        )}
      </div>
      <button 
        onClick={() => nav('/recruiter/applicants')}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm transition"
      >
        Manage in Applicants Manager
      </button>
    </div>
  );
}