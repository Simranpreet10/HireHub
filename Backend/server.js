// ...existing code...
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(express.json());

// Allow configurable frontend origin (use FRONTEND_URL in Backend/.env or fallback to Vite)
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

console.log("CORS allowed origin:", FRONTEND_URL);

// Test DB Connection Message
app.get("/", (req, res) => {
  res.send("Server is running and DB connected!");
});

// ...existing code...
const client = require("./config/database");
const authRoutes = require("./routes/auth");
const recruiterAuth = require("./routes/recruiterAuth");
const jobRoutes = require("./routes/viewJob");
const resetPassword = require("./routes/resetPassword");
const recruiterJobs = require("./routes/recruiterJob");
const jobSearchRoutes = require("./routes/jobSearchRoutes");
const profileRoutes = require("./routes/profileRoutes");
const adminAuthRoute = require("./routes/adminAuthRoutes");
const applicationRoutes = require("./routes/application");
const jobs = require("./routes/job");
const updateCompanyRoute = require("./routes/updatecomapnyRoute");
const recruiterUpdate = require("./routes/recruiterupdate");
const jobTrack = require("./routes/job_trackRoute");
const adminUserRoutes = require("./routes/adminUserRoutes");
const adminRecruiterRoutes = require("./routes/adminRecruiterRoutes");
// const adminApproval = require("./routes/adminApprovalRoute");

// Route Bindings
app.use("/api/userauth", authRoutes);
app.use("/api/recruiterauth", recruiterAuth);
app.use("/api/viewjob", jobRoutes);
app.use("/api/reset-password", resetPassword);
app.use("/api/getRecruiterJobs", recruiterJobs);
app.use("/api/applications", applicationRoutes);
app.use("/api/job", jobs);
app.use("/api/jobsearch", jobSearchRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin/auth", adminAuthRoute);
app.use("/api/updatecompany", updateCompanyRoute);
app.use("/api/recruiterupdate", recruiterUpdate);
app.use("/api/job_track", jobTrack);
app.use("/api/admin/", adminUserRoutes);
app.use("/api/admin/", adminRecruiterRoutes);
// app.use("/api/admin/approval", adminApproval);

// Start Servera
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
  console.error("Server error:", err);
});
