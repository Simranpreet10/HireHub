
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../components/services/AdminApi";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from "recharts";

const CARD_CLASS = "bg-white p-4 rounded shadow flex flex-col justify-between";

export default function Dashboard() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);

  // counts & data
  const [users, setUsers] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      nav("/admin/login");
      return;
    }

    const loadAll = async () => {
      setLoading(true);
      setError(null);
      try {
        // parallel fetches - these endpoints are present in your AdminApi
        const [uRes, rRes, jRes, pRes] = await Promise.allSettled([
          adminApi.getAllUsers(),
          adminApi.getAllRecruiters(),
          adminApi.getAllJobs(),
          adminApi.raw.get("/api/applications") // if you have such route; fallback below
        ]);

        if (uRes.status === "fulfilled") setUsers(uRes.value.data || []);
        if (rRes.status === "fulfilled") setRecruiters(rRes.value.data || []);
        if (jRes.status === "fulfilled") setJobs(jRes.value.data || []);
        if (pRes.status === "fulfilled") setApplications(pRes.value.data || []);

        // fetch recent notifications via admin endpoint if available
        try {
          const nRes = await adminApi.raw.get("/api/admin/notifications"); // optional endpoint
          setNotifications(nRes.data || []);
        } catch (e) {
          console.log(e);
          // if not present, try gathering from users list (some apps keep notifications with users)
          setNotifications([]);
        }
      } catch (err) {
        console.error("dashboard load err:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [nav]);

  // Derived stats
  const totalUsers = users.length;
  const totalRecruiters = recruiters.length;
  const totalJobs = jobs.length;
  const totalApplications = applications.length;

  // Build a jobs-per-day for last 7 days (server should provide posted_date in job items)
  const jobsTimeSeries = useMemo(() => {
    // initialize last 7 days
    const arr = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      arr.push({ date: key, count: 0 });
    }
    const map = new Map(arr.map((x) => [x.date, x]));
    jobs.forEach((j) => {
      const d = j.posted_date ? new Date(j.posted_date).toISOString().slice(0, 10) : null;
      if (d && map.has(d)) map.get(d).count += 1;
    });
    return Array.from(map.values());
  }, [jobs]);

  // user type distribution for pie chart
  const userTypeData = useMemo(() => {
    const counts = {};
    users.forEach((u) => {
      const t = u.user_type || "user";
      counts[t] = (counts[t] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [users]);

  const COLORS = ["#4f46e5", "#06b6d4", "#f59e0b", "#ef4444", "#10b981"];

  // Recent activity lists
  const recentApplications = applications
    .slice()
    .sort((a, b) => new Date(b.apply_date) - new Date(a.apply_date))
    .slice(0, 6);

  const recentJobs = jobs
    .slice()
    .sort((a, b) => new Date(b.posted_date) - new Date(a.posted_date))
    .slice(0, 6);

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gray-100">
        <div className="text-center py-20">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Overview & analytics</p>
        </div>
      </div>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      {/* Top stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className={CARD_CLASS}>
          <div>
            <div className="text-sm text-gray-500">Total Users</div>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </div>
          <div className="text-xs text-gray-400 mt-2">Active users on platform</div>
        </div>

        <div className={CARD_CLASS}>
          <div>
            <div className="text-sm text-gray-500">Recruiters</div>
            <div className="text-2xl font-bold">{totalRecruiters}</div>
          </div>
          <div className="text-xs text-gray-400 mt-2">Companies & recruiters</div>
        </div>

        <div className={CARD_CLASS}>
          <div>
            <div className="text-sm text-gray-500">Jobs</div>
            <div className="text-2xl font-bold">{totalJobs}</div>
          </div>
          <div className="text-xs text-gray-400 mt-2">Active job postings</div>
        </div>

        <div className={CARD_CLASS}>
          <div>
            <div className="text-sm text-gray-500">Applications</div>
            <div className="text-2xl font-bold">{totalApplications}</div>
          </div>
          <div className="text-xs text-gray-400 mt-2">Total applications</div>
        </div>
      </div>

      {/* Charts and lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: line chart (jobs over time) */}
        <div className="col-span-2 bg-white rounded shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Jobs posted (last 7 days)</h3>
            <div className="text-sm text-gray-500">Updated live</div>
          </div>

          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={jobsTimeSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="text-sm text-gray-600">
              <div className="font-medium">Most recent jobs</div>
              <ul className="mt-2 space-y-1">
                {recentJobs.map((j) => (
                  <li key={j.job_id} className="text-xs">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{j.job_title}</div>
                        <div className="text-gray-400">{j.company?.company_name || "-"}</div>
                      </div>
                      <div className="text-gray-400 text-xs">{j.posted_date ? new Date(j.posted_date).toLocaleDateString() : "-"}</div>
                    </div>
                  </li>
                ))}
                {recentJobs.length === 0 && <li className="text-xs text-gray-400">No recent jobs</li>}
              </ul>
            </div>

            <div className="text-sm text-gray-600">
              <div className="font-medium">Recent notifications</div>
              <ul className="mt-2 space-y-1">
                {notifications.slice(0, 5).map((n) => (
                  <li key={n.notification_id || n.id} className="text-xs text-gray-700">
                    <div className="font-medium">{n.notification_type || "Info"}</div>
                    <div className="text-gray-400">{String(n.message).slice(0, 80)}</div>
                  </li>
                ))}
                {notifications.length === 0 && <li className="text-xs text-gray-400">No notifications</li>}
              </ul>
            </div>
          </div>
        </div>

        {/* Right: pie chart + recent applications */}
        <div className="bg-white rounded shadow p-4 flex flex-col">
          <h3 className="text-lg font-semibold mb-3">User distribution</h3>

          <div className="flex-1">
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={userTypeData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80} label>
                    {userTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4">
              <div className="font-medium text-sm mb-2">Recent Applications</div>
              <div className="space-y-2">
                {recentApplications.map((a) => (
                  <div key={a.application_id} className="p-2 border rounded text-sm flex justify-between items-center">
                    <div>
                      <div className="font-medium">{a.job?.job_title || "—"}</div>
                      <div className="text-xs text-gray-500">{a.job?.company?.company_name || "—"}</div>
                    </div>
                    <div className="text-xs text-gray-400">{a.status}</div>
                  </div>
                ))}
                {recentApplications.length === 0 && <div className="text-xs text-gray-400">No recent applications</div>}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => nav("/admin/jobs")}
              className="px-3 py-1 bg-indigo-600 text-white rounded"
            >
              Manage Jobs
            </button>
          </div>
        </div>
      </div>

      {/* Recent applications table */}
      <div className="mt-6 bg-white rounded shadow p-4">
        <h3 className="text-lg font-semibold mb-3">Latest Applications</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-3 py-2">App ID</th>
                <th className="px-3 py-2">Applicant</th>
                <th className="px-3 py-2">Job</th>
                <th className="px-3 py-2">Applied On</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.map((a) => (
                <tr key={a.application_id} className="border-t">
                  <td className="px-3 py-2">{a.application_id}</td>
                  <td className="px-3 py-2">{a.user?.full_name || a.user_id}</td>
                  <td className="px-3 py-2">{a.job?.job_title || a.job_id}</td>
                  <td className="px-3 py-2">{a.apply_date ? new Date(a.apply_date).toLocaleString() : "-"}</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${a.status === "accepted" ? "bg-green-100 text-green-800" : a.status === "rejected" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentApplications.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-3 py-4 text-center text-gray-500">No applications yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="h-8" />
    </div>
  );
}


