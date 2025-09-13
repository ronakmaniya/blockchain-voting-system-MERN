// backend/services/electionMonitor.js
const Election = require("../models/Election");
const env = require("../config/env");

let monitorInterval = null;

/**
 * Close elections whose endAt <= now and status is still "open".
 */
async function closeExpiredElections() {
  try {
    const now = new Date();
    const res = await Election.updateMany(
      { status: "open", endAt: { $lte: now } },
      { $set: { status: "closed" } }
    );
    if (res.matchedCount > 0) {
      console.log(
        `ElectionMonitor: closed ${
          res.modifiedCount
        } election(s) at ${now.toISOString()}`
      );
    }
  } catch (err) {
    console.error("ElectionMonitor error:", err);
  }
}

function startMonitor() {
  // run once immediately
  closeExpiredElections().catch((e) => console.error(e));

  const seconds = Number(env.electionMonitorIntervalSeconds || 60);
  if (monitorInterval) clearInterval(monitorInterval);

  monitorInterval = setInterval(() => {
    closeExpiredElections().catch((err) => console.error(err));
  }, seconds * 1000);

  console.log(`✅ ElectionMonitor started (interval ${seconds}s)`);
}

function stopMonitor() {
  if (monitorInterval) {
    clearInterval(monitorInterval);
    monitorInterval = null;
  }
}

module.exports = { startMonitor, stopMonitor };
