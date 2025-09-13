// backend/config/env.js
const path = require("path");
const dotenv = require("dotenv");

// Load backend .env
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// Load blockchain .env if needed
dotenv.config({ path: path.join(__dirname, "..", "..", "blockchain", ".env") });

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  rpcUrl: process.env.RPC_URL || process.env.GANACHE_URL,
  privateKey: process.env.PRIVATE_KEY || process.env.GANACHE_PRIVATE_KEY,
  jwtSecret: process.env.JWT_SECRET || "mydevsecret",
  // New: default election duration in minutes (override in .env)
  electionDurationMinutes: Number(process.env.ELECTION_DURATION_MINUTES || 60),
  // How often the monitor runs (in seconds)
  electionMonitorIntervalSeconds: Number(
    process.env.ELECTION_MONITOR_INTERVAL_SECONDS || 60
  ),
};
