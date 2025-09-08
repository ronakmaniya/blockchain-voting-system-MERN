// config/db.js
const mongoose = require("mongoose");
const { mongoUri } = require("./env"); // ✅ centralized config

const connectDB = async () => {
  try {
    if (!mongoUri) {
      throw new Error("MONGO_URI not set in environment variables");
    }

    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1); // Stop app if DB fails
  }
};

module.exports = connectDB;
