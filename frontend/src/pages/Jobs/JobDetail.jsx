import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../components/services/api";

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await api.get(`/api/viewjob/${id}`);
        setJob(res.data.job || res.data);
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchJob();
  }, [id]);

  if (loading) return <div className="p-6">Loading job details...</div>;
  if (!job) return <div className="p-6 text-red-600">Job not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg border">
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">
        {job.job_title || job.title}
      </h1>
      <p className="text-gray-600 text-lg mb-4">
        {job.company?.company_name || job.company || "Unknown Company"}
      </p>
      <div className="text-gray-700 mb-4">
        <strong>Location:</strong> {job.location || "Not specified"}
      </div>
      <div className="text-gray-700 mb-4">
        <strong>Salary:</strong> {job.salary ? `₹${job.salary}` : "Not disclosed"}
      </div>
      <div className="text-gray-700">
        <strong>Description:</strong>
        <p className="mt-2">{job.description || "No description available."}</p>
      </div>
    </div>
  );
}
