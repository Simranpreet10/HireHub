import React, { useEffect, useState } from "react";
import api from "../../components/services/api";
import JobCard from "../../components/jobs/JobCard";

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await api.get("/api/viewjob");
        const list = res.data.jobs || res.data || [];
        setJobs(list);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  if (loading) {
    return <div className="text-center p-6 text-gray-600">Loading jobs...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Available Jobs</h2>
      {jobs.length === 0 ? (
        <p className="text-gray-600">No jobs available right now.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <JobCard
              key={job._id || job.job_id}
              job={job}
              onApply={(id) => alert(`Applied for Job ID: ${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
