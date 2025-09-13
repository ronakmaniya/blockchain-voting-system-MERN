// index.js
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { port } = require("./config/env");

const authRoutes = require("./routes/auth");
const electionsRoutes = require("./routes/elections");
const txRoutes = require("./routes/txs");

const { startBlockListener } = require("./services/blockListener");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// mount routes
app.use("/api/auth", authRoutes);
app.use("/api/elections", electionsRoutes);
app.use("/api", txRoutes);

app.get("/", (req, res) => res.send("✅ Backend running"));

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
  // start block listener after server is listening
  startBlockListener();
});
