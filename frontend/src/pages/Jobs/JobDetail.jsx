import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../components/services/api";

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
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
      await API.raw.post("/api/applications/apply", {
        userId: userData.user_id,
        jobId: parseInt(id),
        resume: null,
      });
      
      alert("Application submitted successfully!");
      nav("/applications");
    } catch (error) {
      console.error("Error applying for job:", error);
      alert(error.response?.data?.error || "Failed to apply for job");
    } finally {
      setApplying(false);
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

            {/* Apply Button */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={handleApply}
                disabled={applying}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-lg text-lg font-semibold transition disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {applying ? "Applying..." : "Apply Now"}
              </button>
              <button
                onClick={() => nav("/jobs")}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-4 px-8 rounded-lg text-lg font-semibold transition"
              >
                Back to Jobs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
