// src/pages/Recruiter/ViewAllJobs.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../components/services/api";
import JobCard from "../../components/jobs/JobCard";

export default function ViewAllJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- Fetch jobs ---
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.getAllJobs();
      setJobs(res.data || []);
    } catch (err) {
      console.error("❌ Failed to load jobs:", err);
      alert("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // --- Handle toggle job status ---
  const handleToggleStatus = async (jobId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const res = await api.raw.put(`/api/jobs/${jobId}/status`, { is_active: newStatus });
      console.log("toggle response:", res.data);
      setJobs((prev) =>
        prev.map((j) => (j.job_id === jobId ? { ...j, is_active: newStatus } : j))
      );
    } catch (err) {
      console.error("Failed to toggle:", err);
      alert("Failed to update job status");
    }
  };

  // --- Handle delete job ---
  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      const res = await api.raw.delete(`/api/jobs/${jobId}`);
      alert(res.data.message || "Job deleted");
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert("Failed to delete job");
    }
  };

  // --- Navigate to job details page ---
  const handleView = (jobId) => {
    navigate(`/recruiter/job/${jobId}`);
  };

  if (loading)
    return <div className="p-8 text-center text-gray-500">Loading jobs...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">All Posted Jobs</h1>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs found.</p>
      ) : (
        <div className="grid gap-5">
          {jobs.map((job) => (
            <JobCard
              key={job.job_id}
              job={job}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </div>
      )}
    </div>
  );
}
