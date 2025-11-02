import React from "react";

export default function ProfileModal({ open, onClose, profile, type = "recruiter", onCompanyEdit }) {
  if (!open) return null;

  // recruiter shape: { recruiter_id, full_name, email, company: { ... }, jobs: [...] , user: {...} }
  // company shape: { company_id, company_name, company_info, recruiters: [...], jobs: [...] }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-11/12 md:w-3/4 lg:w-1/2 rounded p-6 max-h-[85vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {type === "company" ? profile?.company_name || "Company" : profile?.full_name || "Recruiter"}
          </h2>
          <button onClick={onClose} className="text-gray-600">Close</button>
        </div>

        {type === "company" ? (
          <>
            <p className="mb-2"><strong>About:</strong> {profile?.company_info || "N/A"}</p>
            <p className="mb-2"><strong>Website:</strong> {profile?.website || "N/A"}</p>
            <p className="mb-2"><strong>Location:</strong> {profile?.location || "N/A"}</p>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Recruiters ({profile?.recruiters?.length || 0})</h3>
              <ul className="space-y-1">
                {profile?.recruiters?.map((rec) => (
                  <li key={rec.recruiter_id} className="text-sm">
                    {rec.full_name} — {rec.email} {rec.is_active ? "(Active)" : "(Inactive)"}
                  </li>
                )) || <li>No recruiters</li>}
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Jobs ({profile?.jobs?.length || 0})</h3>
              <ul className="space-y-1">
                {profile?.jobs?.map((job) => (
                  <li key={job.job_id} className="text-sm">
                    {job.job_title} — Closing: {job.closing_date ? new Date(job.closing_date).toLocaleDateString() : "N/A"}
                  </li>
                )) || <li>No jobs</li>}
              </ul>
            </div>

            <div className="mt-4">
              <button
                onClick={() => onCompanyEdit && onCompanyEdit(profile.company_id)}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Edit Company
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="mb-2"><strong>Name:</strong> {profile?.full_name || "N/A"}</p>
            <p className="mb-2"><strong>Email:</strong> {profile?.email || "N/A"}</p>
            <p className="mb-2"><strong>Joined:</strong> {profile?.date_joined ? new Date(profile.date_joined).toLocaleString() : "N/A"}</p>
            <p className="mb-2"><strong>Status:</strong> {profile?.is_active ? "Active" : "Inactive"}</p>

            <div className="mt-3">
              <h3 className="font-semibold mb-2">Company</h3>
              {profile?.company ? (
                <div className="text-sm">
                  <div>{profile.company.company_name}</div>
                  <div className="text-xs text-gray-600">{profile.company.location}</div>
                </div>
              ) : (
                <div>No company linked</div>
              )}
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Jobs posted ({profile?.jobs?.length || 0})</h3>
              <ul className="space-y-1">
                {profile?.jobs?.map((job) => (
                  <li key={job.job_id} className="text-sm">
                    {job.job_title} — {job.location || "N/A"} — Posted: {job.posted_date ? new Date(job.posted_date).toLocaleDateString() : "N/A"}
                  </li>
                )) || <li>No jobs</li>}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
