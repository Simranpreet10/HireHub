import React from "react";
import { Briefcase, MapPin, Building2, IndianRupee, CalendarDays } from "lucide-react";

const JobCard = ({ job, onToggleStatus, onDelete, onView }) => {
  const title = job.job_title || job.title || "Untitled Job";
  const description = job.description || "No description provided.";
  const companyName =
    job.company?.company_name ||
    job.recruiter?.company?.company_name ||
    "Not specified";
  const location = job.location || "Not specified";
  const type = job.employment_type || job.job_type || "-";
  const ctc = job.ctc ?? job.salary ?? "N/A";
  const posted = job.posted_date
    ? new Date(job.posted_date).toLocaleDateString()
    : "-";
  const closing = job.closing_date
    ? new Date(job.closing_date).toLocaleDateString()
    : "-";
  const isActive =
    job.is_active === undefined ? true : Boolean(job.is_active);

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-5 border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            {title}
          </h3>
          <div className="flex flex-wrap items-center text-gray-500 text-sm gap-2 mt-1">
            <span className="flex items-center gap-1">
              <Building2 className="w-4 h-4" /> {companyName}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {location}
            </span>
          </div>
        </div>

        <span
          className={`px-3 py-1.5 rounded-full text-sm font-medium ${
            isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Job info */}
      <div className="space-y-2 mb-3">
        <p className="text-gray-600 line-clamp-3 text-sm">{description}</p>
        <div className="text-gray-700 text-sm flex flex-wrap gap-4 mt-2">
          <div className="flex items-center gap-1">
            <IndianRupee className="w-4 h-4 text-gray-500" />
            <span className="font-medium">{ctc}</span>
          </div>
          <div className="flex items-center gap-1">
            <Briefcase className="w-4 h-4 text-gray-500" />
            {type}
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <CalendarDays className="w-4 h-4" />
            Posted: {posted}
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <CalendarDays className="w-4 h-4" />
            Closes: {closing}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={() =>
            onToggleStatus && onToggleStatus(job.job_id, isActive)
          }
          className={`px-4 py-2 rounded-md text-white text-sm font-medium transition-all ${
            isActive
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isActive ? "Deactivate" : "Activate"}
        </button>

        <button
          onClick={() => onDelete && onDelete(job.job_id)}
          className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-all"
        >
          Delete
        </button>

        <button
          onClick={() => onView && onView(job.job_id)}
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default JobCard;
