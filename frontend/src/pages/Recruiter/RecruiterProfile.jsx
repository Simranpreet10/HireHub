import React, { useState, useEffect } from "react";
import recruiterApi from "../../components/services/recruiterApi";

export default function RecruiterProfile() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: "", text: "" });

  // ✅ Get recruiter ID from localStorage
  const recruiter = JSON.parse(localStorage.getItem("recruiterData"));
  const recruiterId = recruiter?.recruiter_id;

  useEffect(() => {
    if (recruiterId) fetchProfile();
  }, [recruiterId]);

  const fetchProfile = async () => {
    try {
      const res = await recruiterApi.getProfile(recruiterId);
      setProfile(res.data.recruiter);
    } catch (err) {
      setMsg({ type: "error", text: "Failed to load profile",err });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await recruiterApi.updateProfile(recruiterId, profile);
      setMsg({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setMsg({ type: "error", text: "Update failed" ,err});
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Recruiter Profile</h2>

      {msg.text && (
        <div
          className={`p-3 mb-3 rounded ${
            msg.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="full_name"
          value={profile.full_name || ""}
          onChange={handleChange}
          placeholder="Full Name"
          className="border p-2 w-full rounded"
        />
        <input
          type="email"
          name="email"
          value={profile.email || ""}
          onChange={handleChange}
          placeholder="Email"
          className="border p-2 w-full rounded"
        />
        <input
          type="password"
          name="password"
          value={profile.password || ""}
          onChange={handleChange}
          placeholder="Password"
          className="border p-2 w-full rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 w-full rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
