// src/pages/AdminLogin.jsx
import { useState } from "react";
import adminApi from "../../components/services/AdminApi";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [resetMode, setResetMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await adminApi.adminLogin(form);
      const token = res.data.token;
      localStorage.setItem("adminToken", token);

      alert("✅ Logged in successfully!");
      nav("/admin/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await adminApi.adminResetPassword({
        email: form.email,
        newPassword: form.password,
      });
      alert(res.data?.message || "Password reset successful!");
      setResetMode(false);
    } catch (err) {
      setMessage(err.response?.data?.error || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Admin {resetMode ? "Reset Password" : "Login"}
          </h2>

          {message && (
            <div className="mb-3 text-center text-sm text-red-600">{message}</div>
          )}

          <form onSubmit={resetMode ? handleReset : handleLogin}>
            <input
              type="email"
              placeholder="Admin Email"
              className="border p-2 w-full mb-2"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder={resetMode ? "New Password" : "Password"}
              className="border p-2 w-full mb-4"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded w-full"
              disabled={loading}
            >
              {loading ? "Please wait..." : resetMode ? "Reset Password" : "Login"}
            </button>
          </form>

          <div className="mt-3 text-center">
            <button
              className="text-sm text-gray-600 underline"
              onClick={() => setResetMode((s) => !s)}
            >
              {resetMode ? "Back to login" : "Reset admin password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
