import React, { useEffect, useState } from "react";
import adminApi from "../../components/services/AdminApi";
import { useNavigate } from "react-router-dom";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const navigate = useNavigate();

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAllUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error("fetch users error:", err);
      alert(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Toggle user status
  const handleToggleStatus = async (userId) => {
    try {
      setActionLoading((prev) => ({ ...prev, [userId]: true }));
      const response = await adminApi.toggleUserStatus(userId);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          (user._id || user.user_id) === userId
            ? { ...user, is_active: !user.is_active }
            : user
        )
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Toggle status error:", error);
      alert(error.response?.data?.message || "Failed to toggle user status");
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // Delete user
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      setActionLoading((prev) => ({ ...prev, [userId]: true }));
      await adminApi.deleteUser(userId);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => (user._id || user.user_id) !== userId)
      );
      alert("User deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.response?.data?.message || "Failed to delete user");
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };



  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Users Management</h1>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      {loading && <div className="text-center py-4">Loading users...</div>}

      <div className="space-y-4">
        {users.map((user) => {
          const userId = user._id || user.user_id;
          return (
            <div
              key={userId}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{user.full_name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-xs text-gray-500">
                  Joined:{" "}
                  {user.date_joined
                    ? new Date(user.date_joined).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div className="flex gap-2">
                {/* ✅ View Profile Button */}

                <button
                  onClick={() =>
                    navigate(`/admin/users/${user.user_id}/profile`)
                  }
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  View Profile
                </button>

                <button
                  onClick={() => handleToggleStatus(userId)}
                  className={`px-3 py-1 rounded text-white ${
                    user.is_active
                      ?  "bg-green-500 hover:bg-green-600":"bg-yellow-500 hover:bg-yellow-600"
                  }`}
                  disabled={actionLoading[userId]}
                >
                  {actionLoading[userId]
                    ? "Processing..."
                    : user.is_active
                    ? "Activate"
                    : "Deactivate"}
                </button>

                <button
                  onClick={() => handleDelete(userId)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  disabled={actionLoading[userId]}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}

        {!loading && users.length === 0 && (
          <div className="text-center py-4 text-gray-500">No users found</div>
        )}
      </div>
    </div>
  );
}
