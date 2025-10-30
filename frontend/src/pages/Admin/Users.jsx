import React, { useEffect, useState } from "react";
import adminApi from "../../components/services/AdminApi";
import ProfileModal from "../../pages/admin/ProfileModal"; // correct path
import { useNavigate } from "react-router-dom";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState({}); // { [userId]: boolean }
  const nav = useNavigate();

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAllUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error("fetch users error:", err);
      alert(err.response?.data?.error || err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const toggle = async (user_id, current) => {
    setActionLoading((s) => ({ ...s, [user_id]: true }));
    try {
      await adminApi.toggleUserStatus(user_id, { is_active: !current });
      setUsers((s) => s.map(u => u.user_id === user_id ? { ...u, is_active: !current } : u));
    } catch (err) {
      console.error("toggle user error:", err);
      alert(err.response?.data?.error || err.message || "Failed to update");
    } finally {
      setActionLoading((s) => ({ ...s, [user_id]: false }));
    }
  };

  const del = async (user_id) => {
    if (!confirm("Delete user and related data permanently?")) return;
    setActionLoading((s) => ({ ...s, [user_id]: true }));
    try {
      await adminApi.deleteUser(user_id);
      setUsers((s) => s.filter(u => u.user_id !== user_id));
      // close modal if the deleted user is open
      if (selected?.user_id === user_id) {
        setProfileOpen(false);
        setSelected(null);
      }
    } catch (err) {
      console.error("delete user error:", err);
      alert(err.response?.data?.error || err.message || "Delete failed");
    } finally {
      setActionLoading((s) => ({ ...s, [user_id]: false }));
    }
  };

  // NEW: fetch full profile from single-user endpoint and open modal
  const viewProfile = async (user_id, openInNewPage = false) => {
    try {
      if (openInNewPage) {
        nav(`/admin/user/${user_id}`);
        return;
      }
      // fetch single user with related data
      const res = await adminApi.getUserById(user_id);
      setSelected(res.data);
      setProfileOpen(true);
    } catch (err) {
      console.error("viewProfile error:", err);
      alert(err.response?.data?.message || err.message || "Failed to fetch profile");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Users</h1>
        <button onClick={fetch} className="px-3 py-1 border rounded">Refresh</button>
      </div>

      {loading && <div>Loading...</div>}

      <div className="space-y-3">
        {users.map(u => (
          <div key={u.user_id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">{u.full_name}</div>
              <div className="text-sm text-gray-600">{u.email}</div>
              <div className="text-xs text-gray-500">Type: {u.user_type}</div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => viewProfile(u.user_id)}
                className="px-3 py-1 border rounded"
                disabled={actionLoading[u.user_id]}
              >
                View Profile
              </button>

            

              <button
                onClick={() => toggle(u.user_id, u.is_active)}
                className={`px-3 py-1 rounded text-white ${u.is_active ? "bg-yellow-500" : "bg-green-600"}`}
                disabled={actionLoading[u.user_id]}
              >
                {actionLoading[u.user_id] ? "Please wait..." : (u.is_active ? "Block" : "Unblock")}
              </button>

              <button
                onClick={() => del(u.user_id)}
                className="bg-red-500 px-3 py-1 rounded text-white"
                disabled={actionLoading[u.user_id]}
              >
                {actionLoading[u.user_id] ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        ))}

        {!loading && users.length === 0 && (
          <div className="text-gray-600">No users found</div>
        )}
      </div>

      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} profile={selected} type="user" />
    </div>
  );
}
