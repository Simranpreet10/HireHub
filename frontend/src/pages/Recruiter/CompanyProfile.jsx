import React, { useState, useEffect } from 'react';
import recruiterApi from '../../components/services/RecruiterApi';

const CompanyProfile = () => {
  const [company, setCompany] = useState({
    company_name: '',
    industry_type: '',
    website: '',
    location: '',
    company_info: '',
    company_logo: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [companyId, setCompanyId] = useState(null);

  useEffect(() => {
    // Get company_id from recruiterData
    const recruiterDataStr = localStorage.getItem('recruiterData');
    if (recruiterDataStr) {
      try {
        const recruiterData = JSON.parse(recruiterDataStr);
        if (recruiterData.company_id) {
          setCompanyId(recruiterData.company_id);
          fetchCompany(recruiterData.company_id);
        } else {
          setError('Company ID not found. Please login again.');
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

  const fetchCompany = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await recruiterApi.getCompany(id);
      if (response.data) {
        setCompany({
          company_name: response.data.company_name || '',
          industry_type: response.data.industry_type || '',
          website: response.data.website || '',
          location: response.data.location || '',
          company_info: response.data.company_info || '',
          company_logo: response.data.company_logo || null
        });
      }
    } catch (err) {
      console.error('Error fetching company:', err);
      setError(err.response?.data?.message || 'Failed to load company profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'company_logo' && files[0]) {
      setCompany(prev => ({ ...prev, company_logo: files[0] }));
    } else {
      setCompany(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!companyId) {
      setError('Company ID missing. Please login again.');
      return;
    }
    
    // Simple URL validation - accept common formats
    if (company.website && company.website.trim()) {
      const url = company.website.trim();
      // Allow www.example.com, example.com, https://example.com, http://example.com
      const urlPattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
      if (!urlPattern.test(url)) {
        setError('Please enter a valid website URL (e.g., www.example.com or example.com)');
        return;
      }
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Backend expects JSON with these fields
      const payload = {
        company_name: company.company_name,
        industry_type: company.industry_type,
        website: company.website,
        location: company.location,
        company_info: company.company_info
      };
      
      const response = await recruiterApi.updateCompany(companyId, payload);
      setSuccess('Company profile updated successfully!');
      
      // Refresh data if returned
      if (response.data?.data) {
        setCompany(prev => ({
          ...prev,
          ...response.data.data
        }));
      }
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating company:', err);
      setError(err.response?.data?.message || 'Failed to update company profile');
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
          <label className="block mb-1 font-medium">Company Name *</label>
          <input
            type="text"
            name="company_name"
            value={company.company_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Industry Type</label>
          <input
            type="text"
            name="industry_type"
            value={company.industry_type}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., IT Services, Healthcare, Finance"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Website</label>
          <input
            type="text"
            name="website"
            value={company.website}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., www.amazon.in or https://amazon.com"
          />
          <p className="text-xs text-gray-500 mt-1">Enter your company website (e.g., www.example.com)</p>
        </div>

        <div>
          <label className="block mb-1 font-medium">Location</label>
          <input
            type="text"
            name="location"
            value={company.location}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., New York, USA or MNC"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Company Description</label>
          <textarea
            name="company_info"
            value={company.company_info}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe your company..."
          />
        </div>

        {company.company_logo && typeof company.company_logo === 'string' && (
          <div>
            <label className="block mb-1 font-medium text-gray-700">Current Logo</label>
            <p className="text-sm text-gray-600">{company.company_logo}</p>
          </div>
        )}

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