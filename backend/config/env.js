const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

// Load blockchain .env
require("dotenv").config({
  path: path.join(__dirname, "..", "..", "blockchain", ".env"),
});

module.exports = {
  port: process.env.PORT || 5000,
  rpcUrl: process.env.RPC_URL || process.env.GANACHE_URL,
  privateKey: process.env.PRIVATE_KEY || process.env.GANACHE_PRIVATE_KEY, // fallback if in blockchain .env
};
