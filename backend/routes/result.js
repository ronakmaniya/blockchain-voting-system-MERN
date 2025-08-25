const express = require("express");
const router = express.Router();
const { ethers } = require("ethers");
const { provider, contract } = require("../config/contract");

// GET /api/results
router.get("/", async (req, res) => {
  try {
    // Fetch candidates from blockchain
    const candidates = await contract.getCandidates();

    // Format results
    const results = candidates.map((c, index) => ({
      id: index,
      name: c.name,
      party: c.party,
      votes: c.voteCount.toString(),
    }));

    res.json(results);
  } catch (err) {
    console.error("Error fetching results:", err);
    res.status(500).json({ error: "Error fetching results" });
  }
});

module.exports = router;
