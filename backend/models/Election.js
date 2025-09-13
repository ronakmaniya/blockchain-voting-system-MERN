// backend/models/Election.js
const mongoose = require("mongoose");

const ElectionSchema = new mongoose.Schema(
  {
    txHash: { type: String, required: true, unique: true, index: true }, // link to Transaction
    title: { type: String },
    description: { type: String },
    txSummary: { type: Object, default: null }, // small snapshot: from, to, value, blockNumber, type

    // persisted 'status' that the monitor will set to "closed" when endAt passes.
    status: { type: String, enum: ["open", "closed"], default: "open" },

    // start and end times
    startAt: { type: Date, default: Date.now },
    endAt: { type: Date, default: null },

    // optional duration (minutes) used at creation time; persisted for record
    durationMinutes: { type: Number, default: null },

    // Aggregates for confidence-score voting (1-5)
    averageScore: { type: Number, default: 0 },
    totalVotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Election", ElectionSchema);
