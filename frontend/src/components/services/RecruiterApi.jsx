import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const recruiterInstance = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// attach recruiter token automatically
recruiterInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("recruiterToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const recruiterApi = {
  // ✅ Recruiter Authentication
  register: (payload) => recruiterInstance.post("/api/recruiterauth/register", payload),
  login: (payload) => recruiterInstance.post("/api/recruiterauth/login", payload),

  // ✅ Recruiter Profile
  getProfile: (recruiter_id) => recruiterInstance.get(`/api/recruiterupdate/${recruiter_id}`),
  updateProfile: (recruiter_id, payload) => recruiterInstance.put(`/api/recruiterupdate/${recruiter_id}`, payload),

  // ✅ Company Info
  getCompany: (company_id) => recruiterInstance.get(`/api/updatecompany/company/${company_id}`),
  createCompany: (payload) => recruiterInstance.post("/api/updatecompany/company", payload),
  updateCompany: (company_id, payload) => recruiterInstance.put(`/api/updatecompany/company/${company_id}`, payload),

  // ✅ Jobs CRUD
  getJobs: (recruiter_id) => recruiterInstance.get(`/api/getRecruiterJobs/recruiter/${recruiter_id}/jobs`),
  createJob: (recruiter_id, data) => recruiterInstance.post(`/api/job/recruiter/${recruiter_id}/job`, data),
  postJob: (recruiter_id, data) => recruiterInstance.post(`/api/job/recruiter/${recruiter_id}/job`, data), // Alias for createJob
  updateJob: (recruiter_id, job_id, data) => recruiterInstance.put(`/api/job/recruiter/${recruiter_id}/job/${job_id}`, data),
  deleteJob: (recruiter_id, job_id) => recruiterInstance.delete(`/api/job/recruiter/${recruiter_id}/job/${job_id}`),

  // ✅ Applicant Tracking
  getAllJobsWithApplicants: () => recruiterInstance.get("/api/job_track/jobs"),
  getJobApplicants: (jobId) => recruiterInstance.get(`/api/job_track/job/${jobId}`),
  getApplicationDetail: (applicationId) => recruiterInstance.get(`/api/job_track/application/${applicationId}`),
  updateApplicationStatus: (applicationId, newStatus) => recruiterInstance.put(`/api/applications/${applicationId}/status`, { newStatus }),
};

export default recruiterApi;
