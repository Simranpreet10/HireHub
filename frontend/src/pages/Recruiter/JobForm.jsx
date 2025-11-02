import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import recruiterApi from '../../components/services/RecruiterApi';

export default function PostJob() {
  const navigate = useNavigate();
  const [recruiterId, setRecruiterId] = useState(null);
  const [editingJobId, setEditingJobId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form, setForm] = useState({
    company_id: '',
    job_title: '',
    description: '',
    ctc: '',
    location: '',
    closing_date: '',
    eligibility: '',
    employment_type: '',
    experience_required: ''
  });
  const [message, setMessage] = useState('');

  // ✅ Get recruiterId and company_id from localStorage (after login)
  useEffect(() => {
    const storedRecruiterData = localStorage.getItem("recruiterData");
    if (storedRecruiterData) {
      try {
        const recruiterData = JSON.parse(storedRecruiterData);
        if (recruiterData.recruiter_id) {
          setRecruiterId(recruiterData.recruiter_id);
          // Auto-fill company_id if available
          if (recruiterData.company_id) {
            setForm(prev => ({ ...prev, company_id: recruiterData.company_id }));
          }
        } else {
          setMessage("Recruiter ID not found — please log in again.");
        }
      } catch (err) {
        console.error("Error parsing recruiter data:", err);
        setMessage("Error loading recruiter information.");
      }
    } else {
      setMessage("Recruiter not found — please log in again.");
    }

    // Check if editing existing job
    const editingJob = localStorage.getItem('editingJob');
    if (editingJob) {
      try {
        const job = JSON.parse(editingJob);
        setIsEditMode(true);
        setEditingJobId(job.job_id);
        
        // Format the closing date for date input (YYYY-MM-DD)
        let closingDateFormatted = '';
        if (job.closing_date) {
          try {
            const date = new Date(job.closing_date);
            closingDateFormatted = date.toISOString().split('T')[0];
          } catch (err) {
            console.error('Error formatting date:', err);
          }
        }
        
        setForm({
          company_id: job.company_id || '',
          job_title: job.job_title || '',
          description: job.description || '',
          ctc: job.ctc || '',
          location: job.location || '',
          closing_date: closingDateFormatted,
          eligibility: job.eligibility || '',
          employment_type: job.employment_type || '',
          experience_required: job.experience_required || ''
        });
        
        // Clear the editing data
        localStorage.removeItem('editingJob');
      } catch (err) {
        console.error('Error loading job for editing:', err);
      }
    }
  }, []);

  const handleChange = (e) => 
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recruiterId) {
      setMessage("Recruiter ID missing. Please log in again.");
      return;
    }

    try {
      // Prepare job data with proper data types
      const jobData = {
        company_id: parseInt(form.company_id),
        job_title: form.job_title.trim(),
        description: form.description.trim(),
        ctc: form.ctc ? parseFloat(form.ctc) : null, // Convert to float
        location: form.location.trim(),
        closing_date: form.closing_date ? new Date(form.closing_date).toISOString() : null, // Convert to ISO DateTime
        eligibility: form.eligibility.trim(),
        employment_type: form.employment_type.trim(),
        experience_required: form.experience_required.trim()
      };

      console.log(isEditMode ? "Updating job data:" : "Submitting job data:", jobData);

      if (isEditMode && editingJobId) {
        // Update existing job
        const res = await recruiterApi.updateJob(recruiterId, editingJobId, jobData);
        setMessage("✅ Job updated successfully!");
        console.log(res.data);
        
        // Clear edit state from localStorage
        localStorage.removeItem('editingJob');
        
        // Redirect to job manager after 1 second
        setTimeout(() => {
          navigate('/recruiter/jobs');
        }, 1000);
      } else {
        // Create new job
        const res = await recruiterApi.postJob(recruiterId, jobData);
        setMessage("✅ Job posted successfully!");
        console.log(res.data);
        
        // Reset form but keep company_id
        const storedRecruiterData = localStorage.getItem("recruiterData");
        const recruiterData = JSON.parse(storedRecruiterData);
        
        setForm({
          company_id: recruiterData.company_id || '',
          job_title: '',
          description: '',
          ctc: '',
          location: '',
          closing_date: '',
          eligibility: '',
          employment_type: '',
          experience_required: ''
        });
      }
    } catch (err) {
      console.error(isEditMode ? "Error updating job:" : "Error posting job:", err);
      setMessage(err.response?.data?.message || (isEditMode ? "❌ Error updating job" : "❌ Error posting job"));
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Job' : 'Post a New Job'}</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Job Title *</label>
          <input
            name="job_title"
            value={form.job_title}
            onChange={handleChange}
            type="text"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Software Developer"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Job Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe the job role, responsibilities, and requirements..."
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">CTC (Annual Salary)</label>
          <input
            name="ctc"
            value={form.ctc}
            onChange={handleChange}
            type="number"
            step="0.01"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 1000000 (in your currency)"
          />
          <p className="text-xs text-gray-500 mt-1">Enter annual salary as a number (e.g., 1000000 for 10 LPA)</p>
        </div>

        <div>
          <label className="block mb-1 font-medium">Location *</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            type="text"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Gurugram, India"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Closing Date *</label>
          <input
            name="closing_date"
            value={form.closing_date}
            onChange={handleChange}
            type="date"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Eligibility Criteria</label>
          <input
            name="eligibility"
            value={form.eligibility}
            onChange={handleChange}
            type="text"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 7 CGPA, Bachelor's degree required"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Employment Type *</label>
          <select
            name="employment_type"
            value={form.employment_type}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select Type</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Freelance">Freelance</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Experience Required *</label>
          <input
            name="experience_required"
            value={form.experience_required}
            onChange={handleChange}
            type="text"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 2-3 years or No experience required"
            required
          />
        </div>

        <div className="flex gap-4">
          <button 
            type="submit" 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition shadow-lg hover:shadow-xl"
          >
            {isEditMode ? 'Update Job' : 'Post Job'}
          </button>
          
          {isEditMode && (
            <button 
              type="button"
              onClick={() => {
                localStorage.removeItem('editingJob');
                navigate('/recruiter/jobs');
              }}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition shadow-lg hover:shadow-xl"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
