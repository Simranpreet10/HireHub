// src/pages/admin/UserProfile.jsx
import React, { useEffect, useState } from "react";
import adminApi from "../../components/services/AdminApi";
import { useParams } from "react-router-dom";

export default function UserProfilePage() {
  const { user_id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user_id) return;
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await adminApi.getUserById(user_id);
        setUser(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [user_id]);

  if (loading) return <div>Loading user...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!user) return <div>No user found</div>;

  const renderKV = (k, v) => (
    <div className="flex gap-2">
      <div className="font-medium w-48">{k}:</div>
      <div className="flex-1 break-words">{v === null || v === undefined ? "-" : String(v)}</div>
    </div>
  );

  // build a set of applied job ids for cross-checking later
  const appliedJobIds = new Set((user.applications || []).map((a) => a.job_id || (a.job && a.job.job_id)).filter(Boolean));

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">User Full Profile — {user.full_name}</h2>

      <section className="mb-6">
        <h3 className="font-semibold mb-2">User (schema fields)</h3>
        <div className="space-y-1">
          {renderKV("user_id", user.user_id)}
          {renderKV("full_name", user.full_name)}
          {renderKV("email", user.email)}
          {renderKV("mobile_no", user.mobile_no)}
          {renderKV("work_status", user.work_status)}
          {renderKV("user_type", user.user_type)}
          {renderKV("is_active", String(user.is_active))}
          {renderKV("date_joined", user.date_joined ? new Date(user.date_joined).toLocaleString() : "-")}
        </div>
      </section>

      <section className="mb-6">
        <h3 className="font-semibold mb-2">Profiles</h3>
        <div className="space-y-3">
          {user.profiles && user.profiles.length > 0 ? (
            user.profiles.map((p) => (
              <div key={p.profile_id} className="p-3 border rounded">
                {renderKV("profile_id", p.profile_id)}
                {renderKV("skills", p.skills)}
                {renderKV("marks_10", p.marks_10)}
                {renderKV("marks_12", p.marks_12)}
                {renderKV("marks_graduation", p.marks_graduation)}
                {renderKV("location", p.location)}
                {renderKV("email", p.email)}
                {renderKV("resume", p.resume)}
                {renderKV("additional_info", p.additional_info)}
              </div>
            ))
          ) : (
            <div>No profile entries</div>
          )}
        </div>
      </section>

      <section className="mb-6">
        <h3 className="font-semibold mb-2">Applications (what user applied to)</h3>
        {user.applications && user.applications.length > 0 ? (
          <div className="space-y-2">
            {user.applications.map((app) => {
              const job = app.job;
              return (
                <div key={app.application_id} className="p-3 border rounded">
                  {renderKV("application_id", app.application_id)}
                  {renderKV("status", app.status)}
                  {renderKV("apply_date", app.apply_date ? new Date(app.apply_date).toLocaleString() : "-")}
                  {renderKV("last_updated", app.last_updated ? new Date(app.last_updated).toLocaleString() : "-")}
                  <div className="mt-2">
                    <div className="font-semibold">Job applied:</div>
                    {job ? (
                      <div className="pl-3">
                        {renderKV("job_id", job.job_id)}
                        {renderKV("job_title", job.job_title)}
                        {renderKV("company", job.company?.company_name)}
                        {renderKV("location", job.location)}
                        {renderKV("posted_date", job.posted_date ? new Date(job.posted_date).toLocaleDateString() : "-")}
                        {renderKV("closing_date", job.closing_date ? new Date(job.closing_date).toLocaleDateString() : "-")}
                        {renderKV("ctc", job.ctc)}
                        {renderKV("experience_required", job.experience_required)}
                      </div>
                    ) : (
                      <div>Job details not available</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>No applications found</div>
        )}
      </section>

      <section className="mb-6">
        <h3 className="font-semibold mb-2">Resume Alternates</h3>
        {user.resume_alts && user.resume_alts.length > 0 ? (
          user.resume_alts.map((r) => (
            <div key={r.resume_id} className="p-3 border rounded">
              {renderKV("resume_id", r.resume_id)}
              {renderKV("parsed_data", r.parsed_data)}
              {renderKV("ai_score", r.ai_score)}
              {renderKV("recommendations", r.recommendations)}
            </div>
          ))
        ) : (
          <div>No resume alternates</div>
        )}
      </section>

      <section className="mb-6">
        <h3 className="font-semibold mb-2">Notifications</h3>
        {user.notifications && user.notifications.length > 0 ? (
          user.notifications.map((n) => (
            <div key={n.notification_id} className="p-2 border rounded">
              {renderKV("notification_id", n.notification_id)}
              {renderKV("message", n.message)}
              {renderKV("notification_type", n.notification_type)}
              {renderKV("created_at", n.created_at ? new Date(n.created_at).toLocaleString() : "-")}
              {renderKV("seen", String(n.seen))}
            </div>
          ))
        ) : (
          <div>No notifications</div>
        )}
      </section>

      <section className="mb-6">
        <h3 className="font-semibold mb-2">Recruiter rows (if any)</h3>
        {user.Recruiter && user.Recruiter.length > 0 ? (
          user.Recruiter.map((r) => (
            <div key={r.recruiter_id} className="p-2 border rounded">
              {renderKV("recruiter_id", r.recruiter_id)}
              {renderKV("company_id", r.company_id)}
              {renderKV("full_name", r.full_name)}
              {renderKV("email", r.email)}
              {renderKV("is_active", String(r.is_active))}
              {renderKV("date_joined", r.date_joined ? new Date(r.date_joined).toLocaleString() : "-")}
            </div>
          ))
        ) : (
          <div>User is not a recruiter</div>
        )}
      </section>

      {/* Optional: Available jobs (not applied yet) */}
      <AvailableJobsSection appliedJobIds={appliedJobIds} />
    </div>
  );
}

// Optional component to show available jobs and mark applied ones
function AvailableJobsSection({ appliedJobIds }) {
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await adminApi.getAllJobs();
        if (!mounted) return;
        setJobs(res.data || []);
      } catch (err) {
        console.error("Failed to fetch jobs for available section", err);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="mb-6">
      <h3 className="font-semibold mb-2">Available Jobs (marked if applied)</h3>
      <div className="space-y-2">
        {jobs.map((j) => (
          <div key={j.job_id} className="p-3 border rounded flex justify-between items-center">
            <div>
              <div className="font-semibold">{j.job_title}</div>
              <div className="text-sm">{j.company?.company_name || j.company_name || "-"}</div>
              <div className="text-xs text-gray-500">Posted: {j.posted_date ? new Date(j.posted_date).toLocaleDateString() : "-"}</div>
            </div>
            <div className={`px-3 py-1 rounded ${appliedJobIds.has(j.job_id) ? "bg-yellow-500 text-white" : "bg-green-600 text-white"}`}>
              {appliedJobIds.has(j.job_id) ? "Applied" : "Apply"}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
