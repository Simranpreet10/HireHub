const express = require("express");
const dotenv = require("dotenv");
const client = require("./config/database"); 
const authRoutes = require("./routes/auth");
const recruiterAuth = require("./routes/recruiterAuth");
const jobRoutes = require('./routes/viewJob');
const resetPassword = require('./routes/resetPassword');
const recruiterJobs = require('./routes/recruiterJob');

const jobSearchRoutes = require('./routes/jobSearchRoutes');
const profileRoutes = require('./routes/profileRoutes');


const applicationRoutes=require("./routes/application");

const jobs = require('./routes/job');
const updatecomapnyRoute = require('./routes/updatecomapnyRoute');
const recruiterUpdate = require('./routes/recruiterupdate');
dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/userauth", authRoutes);
app.use("/api/recruiterauth",recruiterAuth); 
app.use('/api/viewjob', jobRoutes);
app.use('/api/reset-password',resetPassword);
app.use('/api/getRecuiterJobs',recruiterJobs);
app.use("/api/applications", applicationRoutes);
app.use('/api/job',jobs);

app.use('/api/jobsearch', jobSearchRoutes);
app.use('/api/profile', profileRoutes);


app.use('/api/updatecompany',updatecomapnyRoute);
app.use('/api/recruiterupdate',recruiterUpdate);

app.get("/", (req, res) => {
  res.send("Server is running and DB connected!");
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
