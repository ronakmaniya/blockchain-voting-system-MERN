const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const votingRoutes = require("./routes/voting");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", votingRoutes);

app.listen(env.port, () => {
  console.log(`Backend running on port ${env.port}`);
});
