// backend/routes/txs.js
const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// GET /api/txs?limit=20&page=1
router.get("/txs", async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(200, Number(req.query.limit) || 50);
    const skip = (page - 1) * limit;
    const txs = await Transaction.find()
      .sort({ blockNumber: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    res.json({ page, limit, count: txs.length, txs });
  } catch (err) {
    console.error("GET /txs", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/tx/:hash", async (req, res) => {
  try {
    const tx = await Transaction.findOne({ txHash: req.params.hash }).lean();
    if (!tx) return res.status(404).json({ error: "Not found" });
    res.json(tx);
  } catch (err) {
    console.error("GET /tx/:hash", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
