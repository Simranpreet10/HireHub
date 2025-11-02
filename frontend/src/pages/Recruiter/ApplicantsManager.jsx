import React, { useState, useEffect } from 'react';
import recruiterApi from '../../components/services/recruiterApi';

const ApplicantsManager = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJob) {
      fetchApplicants(selectedJob);
    }
  }, [selectedJob]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await recruiterApi.getJobs();
      setJobs(response.data);
    } catch (err) {
      setError('Failed to load jobs',err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicants = async (jobId) => {
    try {
      setLoading(true);
      const response = await recruiterApi.getApplicants(jobId);
      setApplicants(response.data);
    } catch (err) {
      setError('Failed to load applicants',err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await recruiterApi.updateApplicationStatus(applicationId, status);
      setApplicants(applicants.map(app => 
        app.id === applicationId ? { ...app, status } : app
      ));
    } catch (err) {
      setError('Failed to update status',err);
    }
  };

  if (loading && !applicants.length) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Manage Applicants</h2>
        
        <select
          value={selectedJob || ''}
          onChange={(e) => setSelectedJob(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="">Select a job</option>
          {jobs.map(job => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {selectedJob && (
          <div className="space-y-4">
            {applicants.map(applicant => (
              <div 
                key={applicant.id} 
                className="border p-4 rounded-lg hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{applicant.name}</h3>
                    <p className="text-sm text-gray-600">{applicant.email}</p>
                    <p className="text-sm text-gray-600">
                      Applied: {new Date(applicant.appliedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <select
                      value={applicant.status}
                      onChange={(e) => updateStatus(applicant.id, e.target.value)}
                      className="p-2 border rounded text-sm"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="REVIEWING">Reviewing</option>
                      <option value="SHORTLISTED">Shortlisted</option>
                      <option value="INTERVIEWED">Interviewed</option>
                      <option value="ACCEPTED">Accepted</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <a 
                    href={applicant.resumeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View Resume
                  </a>
                  
                  {applicant.coverLetter && (
                    <p className="text-sm text-gray-600">
                      <strong>Cover Letter:</strong><br />
                      {applicant.coverLetter}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {applicants.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No applicants yet for this job.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantsManager;