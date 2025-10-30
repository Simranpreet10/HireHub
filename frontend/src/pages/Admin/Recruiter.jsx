import React, { useEffect, useState } from "react";
import adminApi from "../../components/services/AdminApi";
import ProfileModal from "../../pages/Admin/ProfileModal";

export default function AdminRecruiters() {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAllRecruiters();
      setRecruiters(res.data || []);
    } catch (err) { console.log(err);alert("Failed to load recruiters"); } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const toggle = async (recruiter_id, current) => {
    try {
      await adminApi.toggleRecruiterStatus(recruiter_id, { is_active: !current });
      setRecruiters((s) => s.map(r => r.recruiter_id === recruiter_id ? { ...r, is_active: !current } : r));
    } catch (err) {
      console.log(err); alert("Failed to update"); }
  };

  const del = async (recruiter_id) => {
    if (!confirm("Delete recruiter and their jobs permanently?")) return;
    try {
      await adminApi.deleteRecruiter(recruiter_id);
      setRecruiters((s) => s.filter(r => r.recruiter_id !== recruiter_id));
    } catch (err) {
      console.log(err); alert("Delete failed"); }
  };

  const viewProfile = async (recruiter_id) => {
    try {
      const all = await adminApi.getAllRecruiters();
      const r = (all.data || []).find(x => x.recruiter_id === recruiter_id);
      setSelected(r || { recruiter_id });
      setProfileOpen(true);
    } catch (err) {
      console.log(err); alert("Failed to fetch profile"); }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Recruiters</h1>
      {loading && <div>Loading...</div>}
      <div className="space-y-3">
        {recruiters.map(r => (
          <div key={r.recruiter_id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">{r.full_name}</div>
              <div className="text-sm text-gray-600">{r.email}</div>
              <div className="text-xs text-gray-500">Company ID: {r.company_id}</div>
            </div>

            <div className="flex items-center space-x-2">
              <button onClick={() => viewProfile(r.recruiter_id)} className="px-3 py-1 border rounded">View Recruiter</button>

              <button onClick={() => toggle(r.recruiter_id, r.is_active)} className={`px-3 py-1 rounded ${r.is_active ? "bg-yellow-500" : "bg-green-600"} text-white`}>
                {r.is_active ? "Block" : "Unblock"}
              </button>

              <button onClick={() => del(r.recruiter_id)} className="bg-red-500 px-3 py-1 rounded text-white">Delete Permanently</button>
            </div>
          </div>
        ))}
      </div>

      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} profile={selected} type="recruiter" />
    </div>
  );
}
