import React, { useState } from "react";
import api from "../../components/services/api"; // default export from your api.js
import recruiterApi from "../../components/services/recruiterApi"; // ensure this path matches your file
import { useNavigate } from "react-router-dom";

export default function UnifiedLogin() {
  const [role, setRole] = useState("user"); // "user" or "recruiter"
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let res;
      if (role === "recruiter") {
        // recruiterApi.login returns an axios response
        res = await recruiterApi.login({ email: form.email, password: form.password });
      } else {
        // api.login returns the parsed data (per your api.js)
        res = await api.login(form.email, form.password);
      }

      // Normalize: res may be axios response ({ data }) or already data
      const data = res?.data ?? res;
      const token = data?.token ?? data?.accessToken ?? null;
      if (!token) throw new Error("No token returned from server");

      // storage key & redirect
      const storageKey = role === "recruiter" ? "recruiterToken" : "token";
      const redirectTo = role === "recruiter" ? "/recruiter/dashboard" : "/user-dashboard";

      // Persist token & set Authorization header (use api helper if available)
      if (typeof api.setAuthToken === "function") {
        api.setAuthToken(token, storageKey);
      } else {
        try {
          api.raw.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          localStorage.setItem(storageKey, token);
        } catch (err) {
          console.warn("Failed to set auth header manually:", err);
        }
      }

      // Save decoded token payload if present, otherwise save returned user object
      try {
        const parts = token.split(".");
        if (parts.length === 3) {
          const decoded = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
          const payload = decoded.user ?? decoded;
          const dataKey = role === "recruiter" ? "recruiterData" : "userData";
          localStorage.setItem(dataKey, JSON.stringify(payload));
        } else {
          const userObj = data.user ?? data.recruiter ?? data;
          const dataKey = role === "recruiter" ? "recruiterData" : "userData";
          if (userObj) localStorage.setItem(dataKey, JSON.stringify(userObj));
        }
      } catch (err) {
        console.warn("Token decode/save failed:", err);
      }

      // Notify other parts of app to refresh auth state (Navbar etc.)
      try {
        window.dispatchEvent(new Event("authChange"));
      } catch (e) {e}

      // navigate
      nav(redirectTo);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-6 shadow-md rounded">
          <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>

          {/* Role selector */}
          <div className="flex justify-center gap-3 mb-4">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`px-3 py-1 rounded ${role === "user" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            >
              User
            </button>
            <button
              type="button"
              onClick={() => setRole("recruiter")}
              className={`px-3 py-1 rounded ${role === "recruiter" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            >
              Recruiter
            </button>
          </div>

          {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="border p-2 w-full mb-2"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="border p-2 w-full mb-4"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white py-2 px-4 rounded w-full"
            >
              {loading ? "Logging in..." : `Login as ${role === "recruiter" ? "Recruiter" : "User"}`}
            </button>
          </form>

          <div className="mt-3 text-center">
            <button type="button" className="text-sm text-gray-600 underline" onClick={() => nav("/signup")}>
              Create an account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
