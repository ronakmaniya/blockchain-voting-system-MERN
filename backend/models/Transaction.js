// backend/models/Transaction.js
const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    txHash: { type: String, required: true, unique: true },
    from: { type: String, index: true },
    to: { type: String, index: true, default: null },
    valueWei: { type: String },
    valueEth: { type: String },
    blockNumber: { type: Number, index: true },
    gasUsed: { type: String },
    gasPrice: { type: String },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    data: { type: String },
    decodedCall: { type: Object, default: null },
    type: {
      type: String,
      enum: ["contract_creation", "contract_call", "value_transfer", "other"],
      default: "other",
    },
    savedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

TransactionSchema.index({ txHash: 1 }, { unique: true });

module.exports = mongoose.model("Transaction", TransactionSchema);
