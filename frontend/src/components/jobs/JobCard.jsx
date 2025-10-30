import React from "react";
import { useNavigate } from "react-router-dom";

export default function JobCard({ job, onApply }) {
  const nav = useNavigate();

  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <h3 className="text-lg font-semibold">{job.job_title}</h3>
      <p className="text-gray-600">{job.company?.company_name || "Company"}</p>
      <p className="text-gray-500">{job.location || "Remote"}</p>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => nav(`/job/${job._id || job.job_id}`)}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          View Details
        </button>
        <button
          onClick={() => onApply(job._id || job.job_id)}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
