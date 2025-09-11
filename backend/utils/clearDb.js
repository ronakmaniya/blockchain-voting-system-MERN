// backend/utils/clearDb.js

const mongoose = require("mongoose");

async function clearDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await mongoose.connection.dropDatabase();
    console.log("✅ Database cleared successfully");

    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error clearing DB:", err);
  }
}

clearDb();
