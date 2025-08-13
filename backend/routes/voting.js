const express = require("express");
const router = express.Router();
const contract = require("../config/contract");

router.get("/candidates", async (req, res) => {
  try {
    const count = await contract.getCandidateCount();
    let candidates = [];
    for (let i = 0; i < count; i++) {
      const [name, votes] = await contract.getCandidate(i);
      candidates.push({ id: i, name, votes: votes.toString() });
    }
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/vote", async (req, res) => {
  try {
    const { candidateId } = req.body;
    const tx = await contract.vote(candidateId);
    await tx.wait();
    res.json({ message: "Vote submitted", txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
