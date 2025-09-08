// backend/models/Voter.js
const mongoose = require("mongoose");

const VoterSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  // ephemeral nonce used for signature verification; cleared after verify
  nonce: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Voter", VoterSchema);
