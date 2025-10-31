import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../components/services/api";

export default function ProfileSetup() {
  const [userData, setUserData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [form, setForm] = useState({
    skills: "",
    marks_10: "",
    marks_12: "",
    marks_graduation: "",
    location: "",
    email: "",
    additional_info: "",
  });
  const nav = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        nav("/login");
        return;
      }

      API.setAuthToken(token);
      const user = JSON.parse(localStorage.getItem("userData"));
      
      if (!user) {
        nav("/login");
        return;
      }

      setUserData(user);

      // Try to fetch existing profile
      try {
        const profileRes = await API.raw.get(`/api/profile/${user.user_id}`);
        const existingProfile = profileRes.data;
        setProfile(existingProfile);
        
        // Pre-fill form with existing data
        setForm({
          skills: existingProfile.skills || "",
          marks_10: existingProfile.marks_10 || "",
          marks_12: existingProfile.marks_12 || "",
          marks_graduation: existingProfile.marks_graduation || "",
          location: existingProfile.location || "",
          email: existingProfile.email || user.email || "",
          additional_info: existingProfile.additional_info || "",
        });
      } catch (err) {
        // No profile exists yet, use default values
        setForm({
          ...form,
          email: user.email || "",
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      if (error.response?.status === 401) {
        nav("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("user_id", userData.user_id);
      formData.append("skills", form.skills);
      formData.append("marks_10", form.marks_10);
      formData.append("marks_12", form.marks_12);
      formData.append("marks_graduation", form.marks_graduation);
      formData.append("location", form.location);
      formData.append("email", form.email);
      formData.append("additional_info", form.additional_info);
      
      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      const token = localStorage.getItem("token");
      API.setAuthToken(token);

      let response;
      if (profile) {
        // Update existing profile
        response = await API.raw.put(`/api/profile/${userData.user_id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // Create new profile
        response = await API.raw.post("/api/profile/setup", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setMessage({ type: "success", text: profile ? "Profile updated successfully!" : "Profile created successfully!" });
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        nav("/user-dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage({ 
        type: "error", 
        text: error.response?.data?.error || error.message || "Failed to save profile" 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!allowedTypes.includes(file.type)) {
        setMessage({ type: "error", text: "Please upload a PDF, DOC, or DOCX file" });
        e.target.value = null;
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: "error", text: "File size must be less than 5MB" });
        e.target.value = null;
        return;
      }
      
      setResumeFile(file);
      setMessage(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <button
          onClick={() => nav("/user-dashboard")}
          className="text-blue-600 hover:text-blue-800 flex items-center mb-4"
        >
          <span className="mr-2">←</span> Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {profile ? "Edit Profile" : "Complete Your Profile"}
        </h1>
        <p className="text-gray-600 mt-2">
          {profile ? "Update your information to keep your profile current" : "Fill in your details to complete your profile"}
        </p>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 md:p-8">
          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === "success" 
                ? "bg-green-50 text-green-800 border border-green-200" 
                : "bg-red-50 text-red-800 border border-red-200"
            }`}>
              {message.text}
            </div>
          )}

          {/* Personal Information Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">👤</span>
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={userData?.full_name || ""}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  placeholder="e.g., New Delhi, India"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <input
                  type="text"
                  value={userData?.mobile_no || ""}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🎯</span>
              Skills & Expertise
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills (comma-separated) *
              </label>
              <textarea
                placeholder="e.g., JavaScript, React, Node.js, Python, SQL"
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Education Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🎓</span>
              Education
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  10th Grade (%)
                </label>
                <input
                  type="number"
                  placeholder="85.5"
                  step="0.01"
                  min="0"
                  max="100"
                  value={form.marks_10}
                  onChange={(e) => setForm({ ...form, marks_10: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  12th Grade (%)
                </label>
                <input
                  type="number"
                  placeholder="88.5"
                  step="0.01"
                  min="0"
                  max="100"
                  value={form.marks_12}
                  onChange={(e) => setForm({ ...form, marks_12: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Graduation (CGPA/%)
                </label>
                <input
                  type="number"
                  placeholder="8.5 or 85"
                  step="0.01"
                  min="0"
                  max="100"
                  value={form.marks_graduation}
                  onChange={(e) => setForm({ ...form, marks_graduation: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Resume Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📄</span>
              Resume
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Resume (PDF, DOC, DOCX - Max 5MB)
              </label>
              {profile?.resume && (
                <div className="mb-2 text-sm text-gray-600">
                  Current resume: 
                  <a 
                    href={profile.resume} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 ml-2"
                  >
                    View Resume
                  </a>
                </div>
              )}
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {resumeFile && (
                <p className="mt-2 text-sm text-green-600">
                  Selected: {resumeFile.name}
                </p>
              )}
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📝</span>
              Additional Information
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About You / Career Objectives
              </label>
              <textarea
                placeholder="Tell us about yourself, your career goals, experience, achievements..."
                value={form.additional_info}
                onChange={(e) => setForm({ ...form, additional_info: e.target.value })}
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => nav("/user-dashboard")}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {submitting ? "Saving..." : (profile ? "Update Profile" : "Save Profile")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
