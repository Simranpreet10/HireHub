import React, { useEffect, useState } from "react";
import adminApi from "../../components/services/AdminApi";

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAllJobs();
      setJobs(res.data || []);
    } catch (err) { 
      console.error(err);
      alert("Failed to load jobs"); } finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, []);

  const toggle = async (job_id, current) => {
    try {
      // Backend: updateJob expects partial fields. We're toggling is_active.
      await adminApi.updateJob(job_id, { is_active: !current });
      setJobs((s) => s.map(j => j.job_id === job_id ? { ...j, is_active: !current } : j));
    } catch (err) { console.error(err);alert("Failed to update job"); }
  };

  const del = async (job_id) => {
    if (!confirm("Delete job and its applications permanently?")) return;
    try {
      await adminApi.deleteJob(job_id);
      setJobs((s) => s.filter(j => j.job_id !== job_id));
    } catch (err) {console.error(err); alert("Delete failed"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Jobs</h1>
        <button onClick={fetchJobs} className="px-3 py-1 border rounded">Refresh</button>
      </div>

      {loading && <div>Loading jobs...</div>}
      <div className="space-y-3">
        {!loading && jobs.length === 0 && <div>No jobs found</div>}
        {jobs.map(job => (
          <div key={job.job_id} className="bg-white rounded shadow p-4 flex justify-between items-start">
            <div>
              <div className="text-lg font-semibold">{job.job_title || job.title}</div>
              <div className="text-sm text-gray-600">{job.company?.company_name || job.recruiter?.company?.company_name || "-"}</div>
              <div className="text-xs text-gray-500 mt-1">Posted: {job.posted_date ? new Date(job.posted_date).toLocaleDateString() : "-"}</div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => toggle(job.job_id, job.is_active)} className={`px-3 py-1 rounded ${job.is_active ? "bg-yellow-500" : "bg-green-600"} text-white`}>
                {job.is_active ? "Block" : "Unblock"}
              </button>

              <button onClick={() => del(job.job_id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete Permanently</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
