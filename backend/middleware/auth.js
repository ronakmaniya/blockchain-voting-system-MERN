// backend/middleware/auth.js
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.voter = decoded; // includes id, walletAddress
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
