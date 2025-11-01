import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const instance = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// --- Request interceptor: attach token ---
instance.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("recruiterToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- Response interceptor: handle network errors ---
instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response)
      return Promise.reject(new Error("Network error: cannot reach server"));
    return Promise.reject(err);
  }
);

export const api = {
  raw: instance,

  // ---- User auth ----
  signup: (payload) => instance.post("/api/userauth/signup", payload),
  signupVerify: (payload) => instance.post("/api/userauth/signup/verify", payload),
  login: async (email, password) => {
    const res = await instance.post("/api/userauth/login", { email, password });
    return res.data;
  },

  // ---- Recruiter auth ----
  recruiterSignup: (payload) => instance.post("/api/recruiterauth/register", payload),
  recruiterSignupVerify: (payload) => instance.post("/api/recruiterauth/verify", payload),
  recruiterLogin: async (email, password) => {
    const res = await instance.post("/api/recruiterauth/login", { email, password });
    return res.data;
  },

  // ---- Generic helpers ----
  setAuthToken: (token, key = "token") => {
    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        localStorage.setItem(key, token);
      } catch (e) {e}
    } else {
      delete instance.defaults.headers.common["Authorization"];
      try {
        localStorage.removeItem(key);
      } catch (e) {e}
    }
  },

  // ---- Public jobs ----
  getAllJobs: () => instance.get("/api/viewjob"),
  getJobById: (id) => instance.get(`/api/viewjob/${id}`),
  applyJob: (payload) => instance.post("/api/apply", payload),
};

// ✅ Add profile endpoints for both user & recruiter
export const userApi = {
  getProfile: () => instance.get("/api/user/profile"),
  updateProfile: (payload) => instance.put("/api/user/profile", payload),
};

export const recruiterApi = {
  getProfile: () => instance.get("/api/recruiter/profile"),
  updateProfile: (payload) => instance.put("/api/recruiter/profile", payload),
};

export default api;
