const fs = require("fs");
const { Client } = require("pg");

require("dotenv").config();
const fs = require("fs");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync("./ca.pem").toString(),
  },
};


const client = new Client(config);

client.connect((err) => {
  if (err) {
    console.error("Connection error:", err.stack);
    return;
  }

  console.log("Connected successfully!");

  client.query("SELECT VERSION()", (err, result) => {
    if (err) {
      console.error("Query error:", err.stack);
    } else {
      console.log("PostgreSQL Version:", result.rows[0]);
    }

    client.end((err) => {
      if (err) console.error("Disconnection error:", err.stack);
      else console.log("Disconnected.");
    });
  });
});
