// backend/models/VoteRecord.js
const mongoose = require("mongoose");

const VoteRecordSchema = new mongoose.Schema(
  {
    election: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
      index: true,
    },
    voter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voter",
      required: true,
      index: true,
    },
    txHash: { type: String, required: true }, // transaction being voted on
    score: { type: Number, required: true, min: 1, max: 5 }, // 1..5 confidence
    createdAtBlock: { type: Number },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Ensure one vote per voter per election
VoteRecordSchema.index({ election: 1, voter: 1 }, { unique: true });

module.exports = mongoose.model("VoteRecord", VoteRecordSchema);
