const fs = require("fs");
const { Client } = require("pg");
require("dotenv").config();

// PostgreSQL configuration
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync("./ca.pem").toString(), // Ensure ca.pem is in project root
  },
};

const client = new Client(config);

// Connect to the database
client.connect((err) => {
  if (err) {
    console.error("❌ Connection error:", err.stack);
    return;
  }

  console.log("✅ Connected successfully to PostgreSQL!");

});

module.exports = client;
