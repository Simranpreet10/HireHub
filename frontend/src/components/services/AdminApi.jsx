import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:4245";

const raw = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Attach token
raw.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle errors
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
  getUserProfile: (id) => raw.get(`/api/admin/users/${id}/profile`),  // ✅ changed name here
  toggleUserStatus: (userId) =>
    raw.put(`/api/admin/users/${userId}/toggle-status`),
  deleteUser: (userId) => raw.delete(`/api/admin/users/${userId}/delete`),

  /** ---------- RECRUITER MANAGEMENT ---------- **/
  getAllRecruiters: () => raw.get("/api/admin/recruiters"),
  toggleRecruiterStatus: (id, body) =>
    raw.put(`/api/admin/recruiter/${id}/status`, body),
  deleteRecruiter: (id) => raw.delete(`/api/admin/recruiter/${id}`),

  /** ---------- COMPANY MANAGEMENT ---------- **/
  getAllCompanies: () => raw.get("/api/admin/companies"),

  /** ---------- JOB MANAGEMENT ---------- **/
  getAllJobs: () => raw.get("/api/viewjob"),
  getJobById: (id) => raw.get(`/api/viewjob/${id}`),
  updateJob: (id, body) => raw.put(`/api/viewjob/${id}`, body),
  deleteJob: (id) => raw.delete(`/api/viewjob/${id}`),
};

export default adminApi;
