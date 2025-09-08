// index.js (Main Entrypoint)

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { port } = require("./config/env"); // ✅ centralized config

// Import routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const candidateRoutes = require("./routes/candidates");
const resultRoutes = require("./routes/results");
const votingRecordRoutes = require("./routes/votingRecord");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/votingRecords", votingRecordRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("✅ Blockchain Voting System Backend is Running...");
});

// Start server
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
