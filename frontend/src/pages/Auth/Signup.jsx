import { useState } from "react";
import API from "../../components/services/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [step, setStep] = useState(1); // 1 = Signup, 2 = OTP Verify
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    mobile_no: "",
    work_status: "",
    user_type: "user", // user or recruiter
    company_name: "",
    designation: "",
  });
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState(null);
  const nav = useNavigate();

  // ---------------- HANDLE SIGNUP ----------------
  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      // Send signup details (backend sends OTP)
      const res = await API.signup(form);
      setMessage(res.data?.message || "OTP sent to your email");
      setStep(2);
    } catch (err) {
      console.error("Signup error:", err);
      setMessage(err.response?.data?.message || err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- HANDLE OTP VERIFY ----------------
  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      await API.signupVerify({ email: form.email, otp });
      setMessage("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        // reset all fields
        setStep(1);
        setForm({
          full_name: "",
          email: "",
          password: "",
          mobile_no: "",
          work_status: "",
          user_type: "user",
          company_name: "",
          designation: "",
        });
        setOtp("");
        nav("/login");
      }, 1000);
    } catch (err) {
      console.error("OTP verify error:", err);
      setMessage(err.response?.data?.message || err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- RENDER UI ----------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {step === 1 ? (
        <form
          onSubmit={handleSignup}
          className="bg-white p-6 shadow-md rounded w-full max-w-md"
        >
          <h2 className="text-xl font-semibold mb-4 text-center">Signup</h2>

          {message && (
            <div className="mb-3 text-sm text-red-600 text-center">{message}</div>
          )}

          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name *"
            className="border p-2 w-full mb-2"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            required
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email *"
            className="border p-2 w-full mb-2"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password *"
            className="border p-2 w-full mb-2"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          {/* Mobile No */}
          <input
            type="text"
            placeholder="Mobile No"
            className="border p-2 w-full mb-2"
            value={form.mobile_no}
            onChange={(e) => setForm({ ...form, mobile_no: e.target.value })}
          />

          {/* Work Status */}
          <input
            type="text"
            placeholder="Work Status (e.g. Student / Employed)"
            className="border p-2 w-full mb-2"
            value={form.work_status}
            onChange={(e) => setForm({ ...form, work_status: e.target.value })}
          />

          {/* Account Type */}
          <div className="mb-4">
            <label className="text-sm mr-3">Account Type:</label>
            <select
              value={form.user_type}
              onChange={(e) => setForm({ ...form, user_type: e.target.value })}
              className="border p-2"
            >
              <option value="user">User</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          {/* Recruiter-specific fields */}
          {form.user_type === "recruiter" && (
            <>
              <input
                type="text"
                placeholder="Company Name *"
                className="border p-2 w-full mb-2"
                value={form.company_name}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                required
              />

              <input
                type="text"
                placeholder="Designation *"
                className="border p-2 w-full mb-2"
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
                required
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white py-2 px-4 rounded w-full"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

          <div className="mt-3 text-center">
            <button
              type="button"
              className="text-sm text-gray-600 underline"
              onClick={() => nav("/login")}
            >
              Already have an account? Login
            </button>
          </div>
        </form>
      ) : (
        <form
          onSubmit={handleVerify}
          className="bg-white p-6 shadow-md rounded w-full max-w-md"
        >
          <h2 className="text-xl font-semibold mb-4 text-center">Verify OTP</h2>

          {message && (
            <div className="mb-3 text-sm text-red-600 text-center">{message}</div>
          )}

          <p className="text-sm text-gray-500 mb-3 text-center">
            OTP sent to {form.email}
          </p>

          <input
            type="text"
            placeholder="Enter OTP"
            className="border p-2 w-full mb-4"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 px-4 rounded w-full"
          >
            {loading ? "Verifying..." : "Verify & Create Account"}
          </button>

          <div className="mt-3 text-center">
            <button
              type="button"
              className="text-sm text-gray-600 underline"
              onClick={() => {
                setStep(1);
                setOtp("");
              }}
            >
              Back
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
