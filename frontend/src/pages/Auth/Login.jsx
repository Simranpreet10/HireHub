// src/pages/Auth/Login.jsx
import { useState } from "react";
import API from "../../components/services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/context/AuthContext"; // optional: your existing context

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const nav = useNavigate();
  const auth = useAuth?.() || null; // if your app has AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await API.login(form.email, form.password);
      // backend returns { message: "LoggedIn", token }
      const token = data.token;
      if (!token) throw new Error("No token returned");

      // store token locally
      localStorage.setItem("token", token);
      API.setAuthToken(token);

      // Decode token to get user data
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        localStorage.setItem("userData", JSON.stringify(tokenPayload));
      } catch (decodeErr) {
        console.warn("Failed to decode token:", decodeErr);
      }

      // if you have an auth context with login() method, call it
      try {
        if (auth && typeof auth.login === "function") {
          auth.login(token);
        }
      } catch (ctxErr) {
        console.warn("auth context login failed:", ctxErr);
      }

      // Trigger navbar update by dispatching a custom event
      window.dispatchEvent(new Event('authChange'));

      // redirect to user dashboard
      nav("/user-dashboard");
    } catch (err) {
      console.error("login error:", err);
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>

        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

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
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="mt-3 text-center">
          <button type="button" className="text-sm text-gray-600 underline" onClick={() => nav("/signup")}>
            Create an account
          </button>
        </div>
      </form>
    </div>
  );
}
