import React from 'react';
import api  from '../services/api';

 export const JobCard = ({ job, onUpdate }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await api.delete(`/recruiter/jobs/${job.id}`);
        onUpdate();
      } catch (error) {
        // Handle error
        console.error('Error deleting job:', error);
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-bold text-lg mb-2">{job.title}</h3>
      <p className="text-gray-600 mb-4">{job.description}</p>
      
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <span className="mr-4">{job.location}</span>
        <span>{job.type}</span>
      </div>
      
      <div className="flex justify-between">
        <button 
          className="text-blue-600"
          onClick={() => {/* Handle edit */}}
        >
          Edit
        </button>
        <button 
          className="text-red-600"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default JobCard;