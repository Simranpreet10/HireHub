import React, { useEffect, useState } from "react";
import recruiterApi from "../../components/services/RecruiterApi";

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [recruiterId, setRecruiterId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get recruiter_id from localStorage
    const recruiterData = localStorage.getItem('recruiterData');
    if (recruiterData) {
      try {
        const data = JSON.parse(recruiterData);
        if (data.recruiter_id) {
          setRecruiterId(data.recruiter_id);
          fetchJobs(data.recruiter_id);
        } else {
          setError('Recruiter ID not found. Please login again.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error parsing recruiter data:', err);
        setError('Error loading recruiter information');
        setLoading(false);
      }
    } else {
      setError('Please login as recruiter');
      setLoading(false);
    }
  }, []);

  const fetchJobs = async (recId) => {
    try {
      setLoading(true);
      setError(null);
      const res = await recruiterApi.getJobs(recId);
      setJobs(res.data || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err.response?.data?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!recruiterId) {
      alert('Recruiter ID not found. Please login again.');
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }
    
    try {
      console.log(`Deleting job ${jobId} for recruiter ${recruiterId}`);
      const response = await recruiterApi.deleteJob(recruiterId, jobId);
      console.log('Delete response:', response);
      alert('Job deleted successfully!');
      // Refresh jobs list
      fetchJobs(recruiterId);
    } catch (err) {
      console.error('Error deleting job:', err);
      console.error('Error details:', err.response?.data);
      alert(err.response?.data?.message || err.message || 'Failed to delete job. Please try again.');
    }
  };

  const handleEdit = (job) => {
    // Store job data for editing
    localStorage.setItem('editingJob', JSON.stringify(job));
    window.location.href = '/recruiter/jobs/new';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading jobs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Jobs</h2>
        <button
          onClick={() => window.location.href = '/recruiter/jobs/new'}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          + Post New Job
        </button>
      </div>
      
      {jobs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-4xl mb-4">📋</p>
          <p className="text-gray-600 mb-4">No jobs posted yet</p>
          <button
            onClick={() => window.location.href = '/recruiter/jobs/new'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            Post Your First Job
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.job_id} className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.job_title}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>📍 {job.location || "Location not specified"}</p>
                    <p>💰 CTC: {job.ctc ? `₹${job.ctc.toLocaleString()}` : "Not specified"}</p>
                    <p>🏢 {job.employment_type || "Not specified"}</p>
                    <p>📅 Closing: {job.closing_date ? new Date(job.closing_date).toLocaleDateString() : "Not set"}</p>
                  </div>
                </div>
                <div className="flex gap-3 ml-4">
                  <button
                    onClick={() => handleEdit(job)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                    title="Edit this job"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job.job_id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                    title="Delete this job"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
