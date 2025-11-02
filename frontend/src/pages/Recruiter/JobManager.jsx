import React, { useEffect, useState } from "react";
import recruiterApi from "../../components/services/RecruiterApi";

export default function ManageJobs({ recruiterId }) {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await recruiterApi.getJobs(recruiterId);
    setJobs(res.data);
  };

  const handleDelete = async (jobId) => {
    await recruiterApi.deleteJob(recruiterId, jobId);
    fetchJobs();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Jobs</h2>
      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.job_id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{job.job_title}</h3>
              <p className="text-gray-500">{job.location}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(job.job_id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
