// backend/routes/elections.js
const express = require("express");
const router = express.Router();
const Election = require("../models/Election");
const VoteRecord = require("../models/VoteRecord");
const Voter = require("../models/Voter");
const auth = require("../middleware/auth");

// GET /api/elections  -> list (with pagination)
router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const defaultLimit = Math.max(
      1,
      Math.min(100, Number(process.env.PAGE_LIMIT) || 25)
    );
    const limit = Math.min(100, Number(req.query.limit) || defaultLimit);
    const skip = (page - 1) * limit;
    const [total, list] = await Promise.all([
      Election.countDocuments(),
      Election.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ]);

    const now = new Date();
    const withStatus = list.map((el) => {
      const computedStatus =
        el.endAt && new Date(el.endAt) <= now ? "closed" : el.status || "open";
      return { ...el, status: computedStatus };
    });

    res.json({ page, limit, total, results: withStatus });
  } catch (err) {
    console.error("GET /elections error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/elections/:id -> details + aggregated metrics
router.get("/:id", async (req, res) => {
  try {
    const election = await Election.findById(req.params.id).lean();
    if (!election) return res.status(404).json({ error: "Election not found" });

    const votes = await VoteRecord.find({ election: election._id }).populate(
      "voter",
      "name walletAddress"
    );

    const now = new Date();
    const computedStatus =
      election.endAt && new Date(election.endAt) <= now
        ? "closed"
        : election.status || "open";
    election.status = computedStatus;

    res.json({
      election,
      votes,
      totalVotes: election.totalVotes,
      averageScore: election.averageScore,
    });
  } catch (err) {
    console.error("GET /elections/:id error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/elections/:id/vote
// Body: { score: 1..5 }
router.post("/:id/vote", auth, async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) return res.status(404).json({ error: "Election not found" });
    if (String(election.status) !== "open")
      return res.status(400).json({ error: "Election is closed" });

    const voterId = req.voter?.id;
    if (!voterId) return res.status(401).json({ error: "Unauthorized" });

    const voter = await Voter.findById(voterId);
    if (!voter) return res.status(404).json({ error: "Voter not found" });

    const score = Number(req.body.score);
    if (!Number.isInteger(score) || score < 1 || score > 5) {
      return res.status(400).json({ error: "Score must be integer 1..5" });
    }

    // Prevent duplicate vote
    const exists = await VoteRecord.findOne({
      election: election._id,
      voter: voter._id,
    });
    if (exists) return res.status(400).json({ error: "Already voted" });

    // Create VoteRecord
    const vote = await VoteRecord.create({
      election: election._id,
      voter: voter._id,
      txHash: election.txHash,
      score,
      createdAtBlock: null,
    });

    // Update election aggregates
    const oldTotal = election.totalVotes || 0;
    const oldAvg = election.averageScore || 0;
    const newTotal = oldTotal + 1;
    const newAvg = (oldAvg * oldTotal + score) / newTotal;

    election.totalVotes = newTotal;
    election.averageScore = newAvg;
    await election.save();

    res.json({
      message: "Vote recorded",
      voteId: vote._id,
      newAverage: newAvg,
      newTotal,
    });
  } catch (err) {
    console.error("POST /elections/:id/vote error:", err);
    if (err.code === 11000)
      return res.status(400).json({ error: "Already voted" });
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
