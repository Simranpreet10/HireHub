import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../../components/services/api";

export default function JobSearch() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    keyword: searchParams.get("keyword") || "",
    location: searchParams.get("location") || "",
    employment_type: searchParams.get("employment_type") || "",
    min_ctc: searchParams.get("min_ctc") || "",
  });
  const nav = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await API.raw.get("/api/viewjob");
      setJobs(response.data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      
      // Build query string
      const queryParams = new URLSearchParams();
      if (filters.keyword) queryParams.append("keyword", filters.keyword);
      if (filters.location) queryParams.append("location", filters.location);
      if (filters.employment_type) queryParams.append("employment_type", filters.employment_type);
      if (filters.min_ctc) queryParams.append("min_ctc", filters.min_ctc);

      // Update URL params
      setSearchParams(queryParams);

      // Use search API if filters are applied, otherwise get all jobs
      if (queryParams.toString()) {
        const response = await API.raw.get(`/api/jobsearch/search?${queryParams.toString()}`);
        setJobs(response.data || []);
      } else {
        fetchJobs();
      }
    } catch (error) {
      console.error("Error searching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({
      keyword: "",
      location: "",
      employment_type: "",
      min_ctc: "",
    });
    setSearchParams({});
    fetchJobs();
  };

  const handleApply = async (jobId) => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      nav("/login");
      return;
    }

    const userData = JSON.parse(localStorage.getItem("userData"));
    
    if (!userData) {
      nav("/login");
      return;
    }

    try {
      await API.raw.post("/api/applications/apply", {
        userId: userData.user_id,
        jobId: jobId,
        resume: null, // Will be updated to use profile resume
      });
      
      alert("Application submitted successfully!");
      nav("/applications");
    } catch (error) {
      console.error("Error applying for job:", error);
      alert(error.response?.data?.error || "Failed to apply for job");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Jobs</h1>
        <p className="text-gray-600">Find your dream job from thousands of opportunities</p>
      </div>

      {/* Search Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Job title, skills, or company"
              value={filters.keyword}
              onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />

            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />

            <select
              value={filters.employment_type}
              onChange={(e) => setFilters({ ...filters, employment_type: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Job Types</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Freelance">Freelance</option>
            </select>

            <input
              type="number"
              placeholder="Min Salary (LPA)"
              value={filters.min_ctc}
              onChange={(e) => setFilters({ ...filters, min_ctc: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition disabled:bg-blue-400"
            >
              {loading ? "Searching..." : "🔍 Search"}
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-6 rounded-lg transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 text-gray-600">
          Found {jobs.length} job{jobs.length !== 1 ? "s" : ""}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Loading jobs...</div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-6xl mb-4">🔍</p>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Jobs Found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search filters to find more opportunities
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <JobCard
                key={job.job_id}
                job={job}
                onApply={handleApply}
                onViewDetails={(id) => nav(`/jobs/${id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function JobCard({ job, onApply, onViewDetails }) {
  const company = job.company || {};
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {job.job_title}
          </h3>
          <p className="text-gray-600 font-medium mb-2">
            {company.company_name || "Company"}
          </p>
        </div>
        {company.company_logo && (
          <img
            src={company.company_logo}
            alt={company.company_name}
            className="w-12 h-12 rounded object-cover"
          />
        )}
      </div>

      <div className="space-y-2 mb-4 text-sm text-gray-600">
        {job.location && (
          <div className="flex items-center">
            <span className="mr-2">📍</span>
            {job.location}
          </div>
        )}
        {job.ctc && (
          <div className="flex items-center">
            <span className="mr-2">💰</span>
            ₹{job.ctc} LPA
          </div>
        )}
        {job.employment_type && (
          <div className="flex items-center">
            <span className="mr-2">💼</span>
            {job.employment_type}
          </div>
        )}
        {job.experience_required && (
          <div className="flex items-center">
            <span className="mr-2">⏱️</span>
            {job.experience_required}
          </div>
        )}
      </div>

      {job.description && (
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {job.description}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <span>Posted: {new Date(job.posted_date).toLocaleDateString()}</span>
        {job.closing_date && (
          <span>Closes: {new Date(job.closing_date).toLocaleDateString()}</span>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onViewDetails(job.job_id)}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition"
        >
          View Details
        </button>
        <button
          onClick={() => onApply(job.job_id)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}
