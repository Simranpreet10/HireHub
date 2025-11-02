// src/components/services/AdminApi.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:4245";

const raw = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Attach token (admin)
raw.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

raw.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response) {
      return Promise.reject(
        new Error("Network error: cannot reach server at " + API_BASE)
      );
    }
    return Promise.reject(err);
  }
);

const adminApi = {
  raw,

  /** ---------- AUTH ---------- **/
  adminLogin: (data) => raw.post("/api/admin/auth/login", data),

  /** ---------- USER MANAGEMENT ---------- **/
  getAllUsers: () => raw.get("/api/admin/users"),
  getUserProfile: (id) => raw.get(`/api/admin/users/${id}/profile`),

  // === FIXED: use PUT and correct path ===
  toggleUserStatus: (userId) =>
    raw.put(`/api/admin/users/${userId}/toggle-status`),

  // === FIXED: include '/delete' suffix to match backend ===
  deleteUser: (userId) => raw.delete(`/api/admin/users/${userId}/delete`),

  /** ---------- RECRUITER MANAGEMENT ---------- **/
  getAllRecruiters: () => raw.get("/api/admin/recruiters"),
  getRecruiterProfile: (id) => raw.get(`/api/admin/recruiters/${id}/profile`),
  toggleRecruiterStatus: (id) =>
    raw.put(`/api/admin/recruiters/${id}/toggle-status`),
  deleteRecruiter: (id) => raw.delete(`/api/admin/recruiters/${id}`),

  /** ---------- COMPANY MANAGEMENT ---------- **/
getAllCompanies: () => raw.get("/api/admin/companies"),
getCompanyProfile: (companyId) => raw.get(`/api/admin/companies/${companyId}`),

/** ---------- JOB MANAGEMENT ---------- **/
getAllJobs: () => raw.get("/api/viewjob"),
getJob: (jobId) => raw.get(`/api/viewjob/${jobId}`),

updateJob: (jobId, data) => raw.put(`/api/admin/jobs/${jobId}`, data),
deleteJob: (jobId) => raw.delete(`/api/admin/jobs/${jobId}`),

};

export default adminApi;
