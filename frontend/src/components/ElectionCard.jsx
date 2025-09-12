// src/components/ElectionCard.jsx
import React, { useState } from "react";
import VoteModal from "./VoteModal";
import { Link } from "react-router-dom";

export default function ElectionCard({ election, userInfo, onVote }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleVote = async (score) => {
    setBusy(true);
    try {
      await onVote(election._id, score);
      setOpen(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="card election-card"
      style={{ display: "flex", alignItems: "center", gap: 12 }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700 }}>
          {election.title ||
            `Election for ${election.txHash?.slice(0, 10) ?? election._id}`}
        </div>
        <div style={{ color: "#6b7280", marginTop: 6 }}>
          Tx: <span className="code-inline">{election.txHash}</span>
        </div>
        <div style={{ marginTop: 8, color: "#374151", fontSize: 13 }}>
          Created: {new Date(election.createdAt).toLocaleString()} • Status:{" "}
          {election.status || "open"}
        </div>

        {userInfo?.hasVoted ? (
          <div style={{ marginTop: 8, color: "#065f46" }}>
            You voted — score: <strong>{userInfo.score}</strong>
            {typeof election.averageScore !== "undefined" && (
              <span style={{ marginLeft: 12 }}>
                Average: {Number(election.averageScore).toFixed(2)}
              </span>
            )}
            {typeof election.totalVotes !== "undefined" && (
              <span style={{ marginLeft: 12 }}>
                Votes: {election.totalVotes}
              </span>
            )}
          </div>
        ) : (
          <div style={{ marginTop: 8, color: "#6b7280" }}>
            {election.totalVotes
              ? `Votes: ${election.totalVotes}`
              : "No votes yet"}
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {!userInfo?.hasVoted ? (
          <button
            className="btn btn-primary"
            onClick={() => setOpen(true)}
            disabled={busy}
          >
            Vote
          </button>
        ) : (
          // View goes to detail page (so user can see full votes & tx details)
          <Link to={`/elections/${election._id}`} className="btn btn-outline">
            View
          </Link>
        )}

        <button
          className="btn"
          onClick={() => {
            navigator.clipboard
              ?.writeText(election.txHash)
              .then(() => alert("TxHash copied"));
          }}
          disabled={busy}
        >
          Copy TxHash
        </button>
      </div>

      <VoteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        election={election}
        onSubmitVote={handleVote}
      />
    </div>
  );
}
