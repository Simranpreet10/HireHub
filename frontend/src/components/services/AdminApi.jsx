// // src/components/services/AdminApi.js
// import axios from "axios";

// const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:4245";

// const raw = axios.create({
//   baseURL: API_BASE,
//   headers: { "Content-Type": "application/json" },
//   timeout: 15000,
// });

// raw.interceptors.request.use((config) => {
//   const token = localStorage.getItem("adminToken");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// raw.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (!err.response) {
//       return Promise.reject(new Error("Network error: cannot reach server at " + API_BASE));
//     }
//     return Promise.reject(err);
//   }
// );

// async function getAllJobs() {
//   try {
//     return await raw.get("/api/job");
//   } catch (err) {
//     // fallback to /api/viewjob if backend uses that mount
//     if (err.response?.status === 404) {
//       return raw.get("/api/viewjob");
//     }
//     throw err;
//   }
// }

// export default {
//   raw,
//   adminLogin: (data) => raw.post("/api/admin/auth/login", data),
//   getAllUsers: () => raw.get("/api/admin/users"),
//   getAllRecruiters: () => raw.get("/api/admin/recruiters"),
//   getAllCompanies: () => raw.get("/api/admin/companies"),
//   getAllProfiles: () => raw.get("/api/admin/user-profiles"),
//   getAllJobs,
//   toggleRecruiterStatus: (id, body) => raw.put(`/api/admin/recruiter/${id}/status`, body),
//   deleteRecruiter: (id) => raw.delete(`/api/admin/recruiter/${id}`),
//   toggleUserStatus: (id, body) => raw.put(`/api/admin/user/${id}/status`, body),
//   editUser: (id, body) => raw.put(`/api/admin/user/${id}`, body),
//   deleteUser: (id) => raw.delete(`/api/admin/user/${id}`),
//   deleteJob: (id) => raw.delete(`/api/job/${id}`),
// };


// src/components/services/AdminApi.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:4245";

const raw = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

raw.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

raw.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response) {
      return Promise.reject(new Error("Network error: cannot reach server at " + API_BASE));
    }
    return Promise.reject(err);
  }
);

export default {
  raw,
  adminLogin: (data) => raw.post("/api/admin/auth/login", data),

  // reads
  getAllUsers: () => raw.get("/api/admin/users"),
  getAllProfiles: () => raw.get("/api/admin/user-profiles"),
  getAllRecruiters: () => raw.get("/api/admin/recruiters"),
  getAllCompanies: () => raw.get("/api/admin/companies"),
 getUserById: (user_id) => raw.get(`/api/admin/user/${user_id}`),
  // (inside export default { ... })
  // jobs from /api/viewjob
  getAllJobs: () => raw.get("/api/viewjob"),
  getJobById: (id) => raw.get(`/api/viewjob/${id}`),

  // admin job actions (update/delete)
  updateJob: (id, body) => raw.put(`/api/viewjob/${id}`, body),
  deleteJob: (id) => raw.delete(`/api/viewjob/${id}`),




  // admin actions (match your controllers)
  toggleRecruiterStatus: (id, body) => raw.put(`/api/admin/recruiter/${id}/status`, body),
  deleteRecruiter: (id) => raw.delete(`/api/admin/recruiter/${id}`),

  toggleUserStatus: (id, body) => raw.put(`/api/admin/user/${id}/status`, body),
  // editUser: (id, body) => raw.put(`/api/admin/user/${id}`, body),
  deleteUser: (id) => raw.delete(`/api/admin/user/${id}`),


};
