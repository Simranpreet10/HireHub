import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../components/services/api";

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await API.raw.get(`/api/viewjob/${id}`);
        setJob(res.data.job || res.data);
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchJob();
  }, [id]);

  // Check if user has already applied for this job
  useEffect(() => {
    async function checkApplicationStatus() {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("userData"));
      
      if (!token || !userData) return;

      try {
        // Fetch user's applications
        const res = await API.raw.get(`/api/applications/user/${userData.user_id}`);
        const applications = res.data || [];
        
        // Check if user has applied for this job
        const application = applications.find(app => app.job_id === parseInt(id));
        if (application) {
          setHasApplied(true);
          setApplicationId(application.application_id);
        }
      } catch (error) {
        console.error("Error checking application status:", error);
      }
    }
    
    if (id) checkApplicationStatus();
  }, [id]);

  const handleApply = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      alert("Please login to apply for jobs");
      nav("/login");
      return;
    }

    const userData = JSON.parse(localStorage.getItem("userData"));
    
    if (!userData) {
      nav("/login");
      return;
    }

    try {
      setApplying(true);
      const response = await API.raw.post("/api/applications/apply", {
        userId: userData.user_id,
        jobId: parseInt(id),
        resume: null,
      });
      
      console.log('Apply response:', response.data);
      
      // Update state to show withdraw button
      setHasApplied(true);
      if (response.data && response.data.application) {
        setApplicationId(response.data.application.application_id);
        console.log('Application ID set:', response.data.application.application_id);
      } else {
        console.warn('Application object not returned, will need to refresh for withdraw');
        // Re-fetch application status to get the application_id
        setTimeout(async () => {
          try {
            const userData = JSON.parse(localStorage.getItem("userData"));
            const res = await API.raw.get(`/api/applications/user/${userData.user_id}`);
            const applications = res.data || [];
            const application = applications.find(app => app.job_id === parseInt(id));
            if (application) {
              setApplicationId(application.application_id);
              console.log('Application ID fetched:', application.application_id);
            }
          } catch (err) {
            console.error('Error fetching application ID:', err);
          }
        }, 1000);
      }
      
      alert("✅ Application submitted successfully!");
    } catch (error) {
      console.error("Error applying for job:", error);
      alert(error.response?.data?.error || "Failed to apply for job");
    } finally {
      setApplying(false);
    }
  };

  const handleWithdraw = async () => {
    if (!window.confirm("Are you sure you want to withdraw your application?")) {
      return;
    }

    if (!applicationId) {
      alert("❌ Application ID not found. Please refresh the page and try again.");
      return;
    }

    try {
      setWithdrawing(true);
      
      console.log('Withdrawing application:', applicationId);
      
      // Delete the application
      const response = await API.raw.delete(`/api/applications/${applicationId}`);
      console.log('Withdraw response:', response.data);
      
      // Update state to show apply button again
      setHasApplied(false);
      setApplicationId(null);
      
      alert("✅ Application withdrawn successfully!");
    } catch (error) {
      console.error("Error withdrawing application:", error);
      console.error("Error details:", error.response?.data);
      console.error("Status code:", error.response?.status);
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message ||
                          "Failed to withdraw application. Please try again.";
      alert("❌ " + errorMessage);
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading job details...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-red-600 mb-4">Job not found</p>
          <button
            onClick={() => nav("/jobs")}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const company = job.company || {};

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => nav("/jobs")}
          className="text-blue-600 hover:text-blue-800 mb-6 flex items-center"
        >
          <span className="mr-2">←</span> Back to Jobs
        </button>

        {/* Job Card */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{job.job_title}</h1>
                <p className="text-xl opacity-90">{company.company_name || "Company"}</p>
              </div>
              {company.company_logo && (
                <img
                  src={company.company_logo}
                  alt={company.company_name}
                  className="w-20 h-20 bg-white rounded-lg object-cover"
                />
              )}
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 border-b">
            {job.location && (
              <div className="text-center">
                <div className="text-2xl mb-1">📍</div>
                <div className="text-sm text-gray-600">Location</div>
                <div className="font-semibold text-gray-900">{job.location}</div>
              </div>
            )}
            {job.ctc && (
              <div className="text-center">
                <div className="text-2xl mb-1">💰</div>
                <div className="text-sm text-gray-600">Salary</div>
                <div className="font-semibold text-gray-900">₹{job.ctc} LPA</div>
              </div>
            )}
            {job.employment_type && (
              <div className="text-center">
                <div className="text-2xl mb-1">💼</div>
                <div className="text-sm text-gray-600">Job Type</div>
                <div className="font-semibold text-gray-900">{job.employment_type}</div>
              </div>
            )}
            {job.experience_required && (
              <div className="text-center">
                <div className="text-2xl mb-1">⏱️</div>
                <div className="text-sm text-gray-600">Experience</div>
                <div className="font-semibold text-gray-900">{job.experience_required}</div>
              </div>
            )}
          </div>

          {/* Job Description */}
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Job Description</h2>
            <div className="text-gray-700 whitespace-pre-line leading-relaxed mb-6">
              {job.description || "No description available."}
            </div>

            {job.eligibility && (
              <>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Eligibility</h2>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed mb-6">
                  {job.eligibility}
                </div>
              </>
            )}

            {/* Company Info */}
            {company.company_info && (
              <>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">About Company</h2>
                <div className="text-gray-700 leading-relaxed mb-6">
                  {company.company_info}
                </div>
              </>
            )}

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 p-6 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm text-gray-600">Posted On:</span>
                <p className="font-semibold text-gray-900">
                  {new Date(job.posted_date).toLocaleDateString()}
                </p>
              </div>
              {job.closing_date && (
                <div>
                  <span className="text-sm text-gray-600">Application Deadline:</span>
                  <p className="font-semibold text-gray-900">
                    {new Date(job.closing_date).toLocaleDateString()}
                  </p>
                </div>
              )}
              {company.website && (
                <div>
                  <span className="text-sm text-gray-600">Company Website:</span>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-600 hover:text-blue-800"
                  >
                    Visit Website →
                  </a>
                </div>
              )}
              {company.industry_type && (
                <div>
                  <span className="text-sm text-gray-600">Industry:</span>
                  <p className="font-semibold text-gray-900">{company.industry_type}</p>
                </div>
              )}
            </div>

            {/* Apply/Withdraw Button */}
            <div className="mt-8">
              {hasApplied ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                    <svg className="w-6 h-6 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-green-800 font-semibold">Application Submitted</p>
                      <p className="text-green-600 text-sm">You have already applied for this position</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={handleWithdraw}
                      disabled={withdrawing}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 px-8 rounded-lg text-lg font-semibold transition disabled:bg-red-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {withdrawing ? (
                        <>
                          <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Withdrawing...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Withdraw Application
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => nav("/applications")}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-800 py-4 px-8 rounded-lg text-lg font-semibold transition"
                    >
                      View My Applications
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4">
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-lg text-lg font-semibold transition disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {applying ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Applying...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Apply Now
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => nav("/jobs")}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-4 px-8 rounded-lg text-lg font-semibold transition"
                  >
                    Back to Jobs
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
