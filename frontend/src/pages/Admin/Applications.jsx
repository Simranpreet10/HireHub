import { useEffect, useState } from "react";
import { api } from "../../components/services/api";

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Note: backend route is GET /api/applications/admin/all
        const res = await api.raw.get("/api/applications/admin/all");
        setApplications(res.data || []);
      } catch (err) {
        console.error("Failed to load applications:", err);
        alert("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">All Applications</h1>

      {loading ? (
        <div className="text-gray-500">Loading applications...</div>
      ) : applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Applicant</th>
                <th className="p-2 border">Job</th>
                <th className="p-2 border">Company</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Resume</th>
                <th className="p-2 border">Applied On</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.application_id} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border">
                    {app.user?.full_name ?? app.user?.email ?? "N/A"}
                    <div className="text-xs text-gray-500">{app.user?.email}</div>
                  </td>

                  <td className="p-2 border">
                    {app.job?.job_title ?? "N/A"}
                    <div className="text-xs text-gray-500">{app.job?.employment_type}</div>
                  </td>

                  <td className="p-2 border">
                    {app.job?.company?.company_name ?? "N/A"}
                    <div className="text-xs text-gray-500">{app.job?.company?.location}</div>
                  </td>

                  <td className="p-2 border">{app.status}</td>

                  <td className="p-2 border">
                    {app.resume ? (
                      // if resume is a URL
                      <a
                        href={app.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        View Resume
                      </a>
                    ) : (
                      <span className="text-sm text-gray-500">No resume</span>
                    )}
                  </td>

                  <td className="p-2 border">
                    {app.apply_date ? new Date(app.apply_date).toLocaleString() : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
