// import { api } from '../services/api';

// export const recruiterApi = {
//   // Auth Related
//   login: (credentials) => 
//     api.post('/recruiter/login', credentials),
  
//   register: (data) => 
//     api.post('/recruiter/register', data),
  
//   // Profile Management
//   getProfile: () => 
//     api.get('/recruiter/profile'),
  
//   updateProfile: (data) => 
//     api.put('/recruiter/profile', data),
  
//   // Company Profile
//   getCompany: () => 
//     api.get('/company/profile'),
  
//   updateCompany: (data) => {
//     const config = {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     };
//     return api.put('/company/update', data, config);
//   },
  
//   // Job Management
//   getJobs: () => 
//     api.get('/recruiter/jobs'),
  
//   getJob: (jobId) => 
//     api.get(`/recruiter/jobs/${jobId}`),
  
//   createJob: (jobData) => 
//     api.post('/recruiter/jobs', jobData),
  
//   updateJob: (jobId, jobData) => 
//     api.put(`/recruiter/jobs/${jobId}`, jobData),
  
//   deleteJob: (jobId) => 
//     api.delete(`/recruiter/jobs/${jobId}`),
  
//   // Applicant Management
//   getApplicants: (jobId) => 
//     api.get(`/recruiter/jobs/${jobId}/applicants`),
  
//   getApplicantDetails: (applicationId) => 
//     api.get(`/recruiter/applications/${applicationId}`),
  
//   updateApplicationStatus: (applicationId, status) => 
//     api.put(`/recruiter/applications/${applicationId}/status`, { status }),
  
//   // Dashboard Statistics
//   getStatistics: () => 
//     api.get('/recruiter/statistics'),
  
//   // Job Categories and Skills
//   getJobCategories: () => 
//     api.get('/recruiter/job-categories'),
  
//   getSkills: () => 
//     api.get('/recruiter/skills'),
  
//   // Search and Filters
//   searchApplicants: (params) => 
//     api.get('/recruiter/search/applicants', { params }),
  
//   filterApplications: (params) => 
//     api.get('/recruiter/applications/filter', { params }),
  
//   // Bulk Actions
//   bulkUpdateStatus: (applicationIds, status) => 
//     api.put('/recruiter/applications/bulk-status', { applicationIds, status }),
  
//   // Communication
//   sendMessage: (applicationId, message) => 
//     api.post(`/recruiter/applications/${applicationId}/message`, { message }),
  
//   // Error Handler Helper
//   handleError: (error) => {
//     if (error.response) {
//       // Request was made and server responded with error status
//       return {
//         status: error.response.status,
//         message: error.response.data.message || 'An error occurred'
//       };
//     } else if (error.request) {
//       // Request was made but no response received
//       return {
//         status: 503,
//         message: 'Service unavailable. Please try again later.'
//       };
//     } else {
//       // Something else happened while setting up the request
//       return {
//         status: 500,
//         message: 'Unable to complete request.'
//       };
//     }
//   }
// };



// export default recruiterApi;











// src/components/services/recruiterApi.js
import { api as APISingleton } from "../services/api";

// Use the raw axios instance for fine-grained control when needed
const axiosInstance = APISingleton.raw;

export const recruiterApi = {
  
// Auth Related
login: (credentials) => axiosInstance.post("/api/recruiterauth/login", credentials),
register: (data) => axiosInstance.post("/api/recruiterauth/register", data),


  // Profile Management
  getProfile: () => axiosInstance.get("/api/recruiter/profile"),
  updateProfile: (data) => axiosInstance.put("/api/recruiter/profile", data),

  // Company Profile
  getCompany: () => axiosInstance.get("/api/company/profile"),
  updateCompany: (formData) => {
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    return axiosInstance.put("/api/company/update", formData, config);
  },

  // Job Management
  getJobs: () => axiosInstance.get("/api/recruiter/jobs"),
  getJob: (jobId) => axiosInstance.get(`/api/recruiter/jobs/${jobId}`),
  createJob: (jobData) => axiosInstance.post("/api/recruiter/jobs", jobData),
  updateJob: (jobId, jobData) => axiosInstance.put(`/api/recruiter/jobs/${jobId}`, jobData),
  deleteJob: (jobId) => axiosInstance.delete(`/api/recruiter/jobs/${jobId}`),

  // Applicant Management
  getApplicants: (jobId) => axiosInstance.get(`/api/recruiter/jobs/${jobId}/applicants`),
  getApplicantDetails: (applicationId) => axiosInstance.get(`/api/recruiter/applications/${applicationId}`),
  updateApplicationStatus: (applicationId, status) => axiosInstance.put(`/api/recruiter/applications/${applicationId}/status`, { status }),

  // Dashboard Statistics
  getStatistics: () => axiosInstance.get("/api/recruiter/statistics"),

  // Job Categories and Skills
  getJobCategories: () => axiosInstance.get("/api/recruiter/job-categories"),
  getSkills: () => axiosInstance.get("/api/recruiter/skills"),

  // Search and Filters
  searchApplicants: (params) => axiosInstance.get("/api/recruiter/search/applicants", { params }),
  filterApplications: (params) => axiosInstance.get("/api/recruiter/applications/filter", { params }),

  // Bulk Actions
  bulkUpdateStatus: (applicationIds, status) =>
    axiosInstance.put("/api/recruiter/applications/bulk-status", { applicationIds, status }),

  // Communication
  sendMessage: (applicationId, message) =>
    axiosInstance.post(`/api/recruiter/applications/${applicationId}/message`, { message }),

  // Utility: unified error handler
  handleError: (error) => {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data.message || "An error occurred",
      };
    } else if (error.request) {
      return { status: 503, message: "Service unavailable. Please try again later." };
    } else {
      return { status: 500, message: "Unable to complete request." };
    }
  },
};

export default recruiterApi;
