import React, { useState, useEffect } from 'react';
import { api } from '../../components/services/api';
import JobCard from '../../components/jobs/JobCard';

const JobsManager = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/recruiter/jobs');
      setJobs(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Jobs</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Post New Job
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} onUpdate={fetchJobs} />
        ))}
      </div>
    </div>
  );
};

export default JobsManager;