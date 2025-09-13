// backend/config/db.js
const mongoose = require("mongoose");
const { mongoUri } = require("./env"); // ✅ centralized config

async function connectDB() {
  try {
    if (!mongoUri) {
      throw new Error("MONGO_URI not set in environment variables");
    }

    await mongoose.connect(mongoUri); // clean, no options needed
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
}

module.exports = connectDB;
