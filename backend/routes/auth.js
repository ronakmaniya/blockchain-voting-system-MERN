// backend/routes/auth.js
const express = require("express");
const { body, validationResult } = require("express-validator");
const { randomBytes } = require("crypto");
const { verifyMessage } = require("ethers"); // ethers v6 compatible usage
const jwt = require("jsonwebtoken");
const path = require("path");

const Voter = require("../models/Voter");
const { jwtSecret } = require("../config/env");

const router = express.Router();

/**
 * POST /api/auth/signup-request
 * Body: { name, walletAddress }
 * - Creates a Voter record with nonce (but does NOT issue JWT yet).
 * - Returns nonce to be signed by the wallet.
 */
router.post(
  "/signup-request",
  body("name").notEmpty(),
  body("walletAddress").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { name, walletAddress } = req.body;
      const addr = String(walletAddress).toLowerCase();

      // If already registered, return error
      const exists = await Voter.findOne({ walletAddress: addr });
      if (exists)
        return res.status(400).json({ error: "Wallet already registered" });

      // Create voter with nonce
      const nonce = "Signup nonce: " + randomBytes(16).toString("hex");
      const voter = new Voter({ name, walletAddress: addr, nonce });
      await voter.save();

      return res.json({ nonce });
    } catch (err) {
      console.error("signup-request error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

/**
 * POST /api/auth/login-request
 * Body: { walletAddress }
 * - Creates or updates nonce for an existing voter (login).
 * - Returns nonce for signature.
 */
router.post(
  "/login-request",
  body("walletAddress").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const addr = String(req.body.walletAddress).toLowerCase();
      const nonce = "Login nonce: " + randomBytes(16).toString("hex");

      const voter = await Voter.findOne({ walletAddress: addr });
      if (!voter)
        return res.status(404).json({ error: "Wallet not registered" });

      voter.nonce = nonce;
      await voter.save();

      return res.json({ nonce });
    } catch (err) {
      console.error("login-request error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

/**
 * POST /api/auth/verify
 * Body: { walletAddress, signature }
 * - Verifies signature of stored nonce.
 * - If valid -> clears nonce and returns JWT
 */
router.post(
  "/verify",
  body("walletAddress").notEmpty(),
  body("signature").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const walletAddress = String(req.body.walletAddress).toLowerCase();
      const signature = req.body.signature;

      const voter = await Voter.findOne({ walletAddress });
      if (!voter || !voter.nonce)
        return res
          .status(400)
          .json({ error: "Nonce not found; request signup/login first" });

      // Recover signer from signature and stored nonce
      const recovered = verifyMessage(voter.nonce, signature).toLowerCase();
      if (recovered !== walletAddress) {
        return res
          .status(403)
          .json({ error: "Signature does not match wallet" });
      }

      // Signature valid — issue JWT
      const payload = { id: voter._id, walletAddress: voter.walletAddress };
      const token = jwt.sign(payload, jwtSecret, { expiresIn: "2h" });

      // Clear nonce so it cannot be reused
      voter.nonce = null;
      await voter.save();

      return res.json({
        token,
        walletAddress: voter.walletAddress,
        name: voter.name,
      });
    } catch (err) {
      console.error("verify error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

/**
 * GET /api/auth/me
 * - Protected route helper to return logged-in user info.
 * - Use Authorization: Bearer <token>
 */
const auth = require("../middleware/auth");
router.get("/me", auth, async (req, res) => {
  try {
    const voter = await Voter.findById(req.voter.id).select("-nonce");
    if (!voter) return res.status(404).json({ error: "Voter not found" });
    res.json({ voter });
  } catch (err) {
    console.error("me error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
