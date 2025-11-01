import React, { useState } from 'react';
import { api } from '../../components/services/api';

const JobForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salary: '',
    type: 'FULL_TIME',
    experience: '',
    deadline: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/recruiter/jobs', formData);
      // Handle success (redirect or show message)
    } catch (error) {
      // Handle error
        console.error('Error posting job:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Post New Job</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Job Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full border rounded p-2"
            rows={4}
          />
        </div>

        {/* Add other form fields */}
        
        <button 
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Post Job
        </button>
      </form>
    </div>
  );
};

export default JobForm;