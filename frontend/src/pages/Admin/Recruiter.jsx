import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../components/services/AdminApi";
import ProfileModal from "../Admin/RecruiterProfile"; // same modal will be used for recruiter & company

export default function AdminRecruiters() {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const nav = useNavigate();

  // fetch all recruiters
  const fetch = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAllRecruiters();
      setRecruiters(res.data || []);
    } catch (err) {
      console.error("Failed to load recruiters:", err);
      alert("Failed to load recruiters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  // toggle status (activate <-> deactivate)
  const toggle = async (recruiter_id) => {
    try {
      const recruiter = recruiters.find((r) => r.recruiter_id === recruiter_id);
      if (!recruiter) return;

      const action = recruiter.is_active ? "deactivate" : "activate";
      if (!confirm(`Do you want to ${action} this recruiter?`)) return;

      const res = await adminApi.toggleRecruiterStatus(recruiter_id);
      alert(res.data?.message || `Recruiter ${action}d successfully`);

      // refresh or update local state
      setRecruiters((prev) =>
        prev.map((r) =>
          r.recruiter_id === recruiter_id ? { ...r, is_active: !r.is_active } : r
        )
      );
    } catch (err) {
      console.error("Toggle failed:", err);
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  // delete recruiter
  const del = async (recruiter_id) => {
    if (!confirm("Delete recruiter and their jobs permanently?")) return;
    try {
      await adminApi.deleteRecruiter(recruiter_id);
      setRecruiters((prev) => prev.filter((r) => r.recruiter_id !== recruiter_id));
      alert("Recruiter deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // view single recruiter profile (uses admin API single recruiter endpoint)
  const viewProfile = async (recruiter_id) => {
    try {
      const res = await adminApi.getRecruiterProfile(recruiter_id);
      setSelected(res.data || null);
      setProfileOpen(true);
    } catch (err) {
      console.error("Failed to fetch recruiter profile:", err);
      alert(err.response?.data?.message || "Failed to fetch profile");
    }
  };

  // view company profile (fetch company by id, open modal with type="company")
  const viewCompany = async (companyId) => {
    try {
      const res = await adminApi.getCompanyProfile(companyId);
      setSelected(res.data || null);
      setProfileOpen(true);
    } catch (err) {
      console.error("Failed to fetch company profile:", err);
      alert(err.response?.data?.message || "Failed to fetch company profile");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Recruiters</h1>
      {loading && <div>Loading...</div>}

      <div className="space-y-3">
        {recruiters.map((r) => (
          <div
            key={r.recruiter_id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <div className="font-semibold">{r.full_name}</div>
              <div className="text-sm text-gray-600">{r.email}</div>
              <div className="text-xs text-gray-500">
                Company: {r.company?.company_name || "N/A"}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => viewProfile(r.recruiter_id)}
                className="px-3 py-1 border rounded  bg-blue-500 text-white  hover:bg-blue-600"
              >
                View Profile
              </button>

              <button
                onClick={() => viewCompany(r.company_id)}
                className="px-3 py-1 border rounded  bg-blue-500 text-white hover:bg-blue-600"
                title="View Company"
              >
                View Company
              </button>

              <button
                onClick={() => toggle(r.recruiter_id)}
                className={`px-3 py-1 rounded text-white ${
                  r.is_active ?   "bg-green-600":"bg-yellow-500"
                }`}
              >
                {r.is_active ? "Activate" : "Deactivate"}
              </button>

              <button
                onClick={() => del(r.recruiter_id)}
                className="bg-red-500 px-3 py-1 rounded text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <ProfileModal
        open={profileOpen}
        onClose={() => {
          setProfileOpen(false);
          setSelected(null);
        }}
        profile={selected}
        type={selected?.company_id ? "recruiter" : selected?.company_name ? "company" : "recruiter"}
        onCompanyEdit={(companyId) => nav(`/admin/company/${companyId}/edit`)}
      />
    </div>
  );
}
