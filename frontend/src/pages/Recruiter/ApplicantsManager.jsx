import React, { useState, useEffect } from 'react';
import recruiterApi from '../../components/services/RecruiterApi';

const ApplicantsManager = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recruiterId, setRecruiterId] = useState(null);

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

  useEffect(() => {
    if (selectedJob) {
      fetchApplicants(selectedJob);
    }
  }, [selectedJob]);

  const fetchJobs = async (recId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await recruiterApi.getJobs(recId);
      setJobs(response.data || []);
    } catch (err) {
      console.error('Error loading jobs:', err);
      setError(err.response?.data?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicants = async (jobId) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching applicants for job:', jobId);
      const response = await recruiterApi.getJobApplicants(jobId);
      console.log('Applicants response:', response.data);
      
      // Response contains job with applications array
      if (response.data && response.data.applications) {
        setApplicants(response.data.applications);
        console.log('Applicants loaded:', response.data.applications.length);
      } else {
        console.log('No applications found in response');
        setApplicants([]);
      }
    } catch (err) {
      console.error('Error loading applicants:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to load applicants');
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      console.log('Updating application status:', applicationId, 'to', status);
      const response = await recruiterApi.updateApplicationStatus(applicationId, status);
      console.log('Status update response:', response.data);
      
      // Update local state - use application_id not id
      setApplicants(applicants.map(app => 
        app.application_id === applicationId ? { ...app, status } : app
      ));
      
      // Show success message briefly
      const successMsg = 'Status updated successfully!';
      setError(null);
      
      // Optional: You could show a success toast here
      console.log(successMsg);
    } catch (err) {
      console.error('Error updating status:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to update status');
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
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 mb-4"
        >
          <option value="">Select a job</option>
          {jobs.map(job => (
            <option key={job.job_id} value={job.job_id}>
              {job.job_title}
            </option>
          ))}
        </select>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {selectedJob && applicants.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-4xl mb-2">📭</p>
            <p>No applications yet for this job</p>
          </div>
        )}

        {selectedJob && applicants.length > 0 && (
          <div className="space-y-4">
            {applicants.map(applicant => (
              <div 
                key={applicant.application_id} 
                className="border p-4 rounded-lg hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{applicant.user?.full_name || 'Applicant'}</h3>
                    <p className="text-sm text-gray-600">{applicant.user?.email || 'No email'}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      📅 Applied: {applicant.apply_date ? new Date(applicant.apply_date).toLocaleDateString() : 'N/A'}
                    </p>
                    {applicant.user?.mobile_no && (
                      <p className="text-sm text-gray-600">
                        📞 {applicant.user.mobile_no}
                      </p>
                    )}
                  </div>
                  <div className="space-x-2">
                    <select
                      value={applicant.status || 'PENDING'}
                      onChange={(e) => updateStatus(applicant.application_id, e.target.value)}
                      className="p-2 border rounded text-sm"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="APPLIED">Applied</option>
                      <option value="ACCEPTED">Accepted</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  {applicant.resume && (
                    <a 
                      href={applicant.resume} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm block"
                    >
                      📄 View Resume
                    </a>
                  )}
                  
                  {applicant.cover_letter && (
                    <div className="text-sm text-gray-600 mt-2">
                      <strong>Cover Letter:</strong>
                      <p className="mt-1">{applicant.cover_letter}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantsManager;