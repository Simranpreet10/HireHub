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
  register: (payload) => recruiterInstance.post("/api/recruiter/register", payload),
  verifyOtp: (payload) => recruiterInstance.post("/api/recruiter/verify", payload),
  login: (payload) => recruiterInstance.post("/api/recruiter/login", payload),

  // ✅ Recruiter Profile
  getProfile: () => recruiterInstance.get("/api/recruiter/profile"),
  updateProfile: (payload) => recruiterInstance.put("/api/recruiter/profile", payload),

  // ✅ Company Info
  getCompany: () => recruiterInstance.get("/api/company/profile"),
  updateCompany: (formData) => {
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    return recruiterInstance.put("/api/company/update", formData, config);
  },

  // ✅ Jobs CRUD
  getJobs: () => recruiterInstance.get("/api/recruiter/jobs"),
  getJob: (id) => recruiterInstance.get(`/api/recruiter/jobs/${id}`),
  createJob: (data) => recruiterInstance.post("/api/recruiter/jobs", data),
  updateJob: (id, data) => recruiterInstance.put(`/api/recruiter/jobs/${id}`, data),
  deleteJob: (id) => recruiterInstance.delete(`/api/recruiter/jobs/${id}`),
};

export default recruiterApi;
