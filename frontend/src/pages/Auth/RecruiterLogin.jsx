import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../components/services/api";

export default function RecruiterLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await API.raw.post("/api/recruiterauth/login", {
        email: form.email,
        password: form.password,
      });

      const { token, recruiter } = response.data;

      if (!token) {
        throw new Error("No token returned");
      }

      // Decode JWT token to extract payload
      let tokenData = {};
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
          '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''));
        tokenData = JSON.parse(jsonPayload);
      } catch (err) {
        console.warn("Could not decode token:", err);
      }

      // Merge recruiter data with token data to ensure all IDs are present
      const fullRecruiterData = {
        ...recruiter,
        recruiter_id: tokenData.recruiter_id || recruiter.recruiter_id,
        company_id: tokenData.company_id || recruiter.company_id,
        user_id: tokenData.user_id || recruiter.user_id
      };

      console.log("Login successful. Recruiter data:", fullRecruiterData);

      // Store token and recruiter data
      localStorage.setItem("recruiterToken", token);
      localStorage.setItem("recruiterData", JSON.stringify(fullRecruiterData));

      // Trigger navbar update
      window.dispatchEvent(new Event('authChange'));

      // Redirect to recruiter dashboard
      nav("/recruiter/dashboard");
    } catch (err) {
      console.error("Recruiter login error:", err);
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 shadow-2xl rounded-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Recruiter Login</h2>
          <p className="text-gray-600">Sign in to manage your job postings</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="recruiter@company.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:bg-blue-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <Link 
            to="/recruiter/signup" 
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Don't have an account? Register as Recruiter →
          </Link>
          <div className="text-sm text-gray-500">
            <Link to="/login" className="hover:text-gray-700">
              Login as Job Seeker
            </Link>
            {" | "}
            <Link to="/admin/login" className="hover:text-gray-700">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
