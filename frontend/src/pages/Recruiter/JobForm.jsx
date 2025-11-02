import React, { useState, useEffect } from 'react';
import recruiterApi from '../../components/services/recruiterApi';

export default function PostJob() {
  const [recruiterId, setRecruiterId] = useState(null);
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

  // ✅ Get recruiterId from localStorage (after login)
  useEffect(() => {
    const storedRecruiter = JSON.parse(localStorage.getItem("recruiter"));
    if (storedRecruiter && storedRecruiter._id) {
      setRecruiterId(storedRecruiter._id);
    } else {
      setMessage("Recruiter not found — please log in again.");
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
      const res = await recruiterApi.postJob(recruiterId, form);
      setMessage("✅ Job posted successfully!");
      console.log(res.data);
      setForm({
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
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "❌ Error posting job");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Post a New Job</h2>
      {message && <div className="mb-3 text-blue-600">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-3">
        {Object.keys(form).map((key) => (
          <div key={key}>
            <label className="block capitalize mb-1">{key.replace('_', ' ')}</label>
            <input
              name={key}
              value={form[key]}
              onChange={handleChange}
              type={key.includes('date') ? 'date' : 'text'}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
}
