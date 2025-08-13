const express = require("express");
const router = express.Router();
const { ethers } = require("ethers");
const env = require("../config/env");
const contractTemplate = require("../config/contract");

// Create a provider
const provider = new ethers.JsonRpcProvider(env.rpcUrl);

// GET /candidates remains the same
router.get("/candidates", async (req, res) => {
  try {
    const count = await contractTemplate.getCandidateCount();
    let candidates = [];
    for (let i = 0; i < count; i++) {
      const [name, votes] = await contractTemplate.getCandidate(i);
      candidates.push({ id: i, name, votes: votes.toString() });
    }
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /vote with dynamic wallet
router.post("/vote", async (req, res) => {
  try {
    const { candidateId, privateKey } = req.body;

    if (!privateKey) {
      return res.status(400).json({ error: "Missing privateKey in request body" });
    }

    // Create a wallet connected to the provider
    const wallet = new ethers.Wallet(privateKey, provider);

    // Connect contract to this wallet
    const contract = contractTemplate.connect(wallet);

    // Send vote
    const tx = await contract.vote(candidateId);
    await tx.wait();

    res.json({ message: "Vote submitted", txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
