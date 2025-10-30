// src/components/services/api.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const instance = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response) return Promise.reject(new Error("Network error: cannot reach server"));
    return Promise.reject(err);
  }
);

export default {
  raw: instance,
  signup: (payload) => instance.post("/auth/signup", payload),
  signupVerify: (payload) => instance.post("/auth/signup-verify", payload),
  login: async (email, password) => {
    const res = await instance.post("/auth/login", { email, password });
    return res.data;
  },
  setAuthToken: (token) => {
    if (token) instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else delete instance.defaults.headers.common["Authorization"];
  },
};
