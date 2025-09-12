// src/pages/ElectionDetail.jsx
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getElection } from "../utils/api";
import AuthContext from "../contexts/authContext";

export default function ElectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const token = user?.token || null;
  const walletAddress = user?.walletAddress?.toLowerCase?.() || null;

  const [loading, setLoading] = useState(true);
  const [election, setElection] = useState(null);
  const [votes, setVotes] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [userScore, setUserScore] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const dr = await getElection(id, token);
      const el = dr.election || dr;
      const vs = dr.votes || (Array.isArray(dr) ? dr : []);
      setElection(el);
      setVotes(Array.isArray(vs) ? vs : []);

      if (walletAddress && Array.isArray(vs)) {
        const found = vs.find(
          (v) => (v.voter?.walletAddress || "").toLowerCase() === walletAddress
        );
        if (found) {
          setHasVoted(true);
          setUserScore(found.score);
        } else {
          setHasVoted(false);
          setUserScore(null);
        }
      } else {
        setHasVoted(false);
        setUserScore(null);
      }
    } catch (err) {
      console.error("getElection error", err);
      setError("Failed to load election");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token, walletAddress]);

  if (loading)
    return (
      <div className="card">
        <p>Loading election...</p>
      </div>
    );
  if (error)
    return (
      <div className="card">
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  if (!election)
    return (
      <div className="card">
        <p>Election not found</p>
      </div>
    );

  const avg =
    election.averageScore ??
    (votes.length
      ? votes.reduce((s, v) => s + Number(v.score || 0), 0) / votes.length
      : 0);
  const total = election.totalVotes ?? votes.length;

  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ margin: 0 }}>Election Detail</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <strong>Transaction:</strong>
        <div
          className="code-box"
          style={{ marginTop: 6, wordBreak: "break-all" }}
        >
          {election.txHash}
        </div>

        {election.txSummary && (
          <div style={{ marginTop: 10 }}>
            <div>
              <strong>From:</strong> {election.txSummary.from}
            </div>
            <div>
              <strong>To:</strong> {election.txSummary.to || "—"}
            </div>
            <div>
              <strong>Value:</strong> {election.txSummary.valueEth ?? "0"} ETH
            </div>
            <div>
              <strong>Type:</strong> {election.txSummary.type || "unknown"}
            </div>
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <strong>Status:</strong> {election.status || "open"} •{" "}
          <strong>Created:</strong>{" "}
          {new Date(election.createdAt).toLocaleString()}
        </div>

        <div style={{ marginTop: 12 }}>
          <strong>Votes:</strong> {total} • <strong>Average score:</strong>{" "}
          {Number(avg).toFixed(2)}
        </div>

        <div style={{ marginTop: 12 }}>
          {/* No voting here - instruct user to use Dashboard to vote */}
          {!hasVoted ? (
            <p style={{ color: "#6b7280" }}>
              To vote on this transaction, go to the <strong>Dashboard</strong>{" "}
              and click <em>Vote</em> on the election item.
            </p>
          ) : (
            <div style={{ color: "#065f46", marginTop: 6 }}>
              You voted — score: <strong>{userScore}</strong>
            </div>
          )}
        </div>

        {/* Show votes only after user has voted */}
        {hasVoted && (
          <div style={{ marginTop: 16 }}>
            <h4>All Votes</h4>
            {votes.length === 0 ? (
              <p>No votes yet</p>
            ) : (
              <ul>
                {votes.map((v) => (
                  <li key={v._id || v.txHash + Math.random()}>
                    <strong>{v.voter?.walletAddress ?? "unknown"}</strong> —
                    score: {v.score}{" "}
                    {v.createdAt
                      ? `• ${new Date(v.createdAt).toLocaleString()}`
                      : ""}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
