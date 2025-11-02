// src/pages/Admin/UserProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminApi from "../../components/services/AdminApi";

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        console.log("Frontend requesting profile for:", userId);
        const res = await adminApi.getUserProfile(userId);
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError(err.response?.data?.message || err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    if (userId) load();
  }, [userId]);

  if (loading) return <div className="p-4">Loading profile...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!profile) return <div className="p-4">No profile found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Profile</h1>
          <button onClick={() => navigate('/admin/users')} className="px-4 py-2 bg-gray-500 text-white rounded">Back</button>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Basic</h2>
          <p><strong>Name:</strong> {profile.full_name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Mobile:</strong> {profile.mobile_no || "-"}</p>
          <p><strong>Joined:</strong> {profile.date_joined ? new Date(profile.date_joined).toLocaleString() : "-"}</p>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold">Profiles</h2>
          {profile.profiles.length === 0 ? (
            <p>No profile entries</p>
          ) : profile.profiles.map(p => (
            <div key={p.profile_id} className="border p-2 my-2 rounded">
              <p><strong>Skills:</strong> {p.skills || "-"}</p>
              <p><strong>Location:</strong> {p.location || "-"}</p>
              <p><strong>Resume:</strong> {p.resume || "-"}</p>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold">Applications</h2>
          {profile.applications.length === 0 ? <p>No applications</p> : (
            profile.applications.map(a => (
              <div key={a.application_id} className="border p-2 my-2 rounded">
                <p><strong>Job:</strong> {a.job?.job_title || a.job?.title || "-"}</p>
                <p><strong>Status:</strong> {a.status}</p>
                <p><strong>Applied:</strong> {a.apply_date ? new Date(a.apply_date).toLocaleString() : "-"}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
