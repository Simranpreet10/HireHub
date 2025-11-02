import React, { useState, useEffect } from 'react';
import recruiterApi from '../../components/services/recruiterApi';

const CompanyProfile = () => {
  const [company, setCompany] = useState({
    name: '',
    industry: '',
    size: '',
    website: '',
    location: '',
    description: '',
    founded: '',
    logo: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      const response = await recruiterApi.getCompany();
      setCompany(response.data);
    } catch (err) {
      setError('Failed to load company profile',err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'logo' && files[0]) {
      setCompany(prev => ({ ...prev, logo: files[0] }));
    } else {
      setCompany(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(company).forEach(([key, value]) => {
        if (value !== null) formData.append(key, value);
      });
      
      await recruiterApi.updateCompany(formData);
      setSuccess('Company profile updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update company profile',err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Company Profile</h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-600 p-3 rounded mb-4">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Company Name</label>
          <input
            type="text"
            name="name"
            value={company.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Industry</label>
          <input
            type="text"
            name="industry"
            value={company.industry}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Company Size</label>
          <select
            name="size"
            value={company.size}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select size</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="501+">501+ employees</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Website</label>
          <input
            type="url"
            name="website"
            value={company.website}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={company.location}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Founded Year</label>
          <input
            type="number"
            name="founded"
            value={company.founded}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="1800"
            max={new Date().getFullYear()}
          />
        </div>

        <div>
          <label className="block mb-1">Company Logo</label>
          <input
            type="file"
            name="logo"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            accept="image/*"
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={company.description}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default CompanyProfile;