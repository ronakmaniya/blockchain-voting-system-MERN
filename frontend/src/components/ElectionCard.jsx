// frontend/src/components/ElectionCard.jsx
import React, { useState } from "react";
import VoteModal from "./VoteModal";
import { Link } from "react-router-dom";

function StatusBadge({ status }) {
  const s = status?.toLowerCase?.() || "unknown";
  const style = {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 700,
    color: "#fff",
  };
  if (s === "open") {
    return <span style={{ ...style, background: "#16a34a" }}>OPEN</span>;
  } else if (s === "closed") {
    return <span style={{ ...style, background: "#dc2626" }}>CLOSED</span>;
  } else {
    return <span style={{ ...style, background: "#6b7280" }}>UNKNOWN</span>;
  }
}

export default function ElectionCard({ election, userInfo = {}, onVote }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  // determine availability
  const isOpen = String(election.status || "open").toLowerCase() === "open";
  const hasVoted = !!userInfo?.hasVoted;

  async function handleVote(score) {
    setBusy(true);
    try {
      // Defensive: do not attempt if closed
      if (!isOpen) throw new Error("Election is closed");
      await onVote(election._id, score);
      setOpen(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="card election-card"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: 16,
      }}
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
          Created: {new Date(election.createdAt).toLocaleString()} •{" "}
          <StatusBadge status={election.status} />
        </div>

        <div style={{ marginTop: 8 }}>
          {hasVoted ? (
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
          ) : isOpen ? (
            <div style={{ marginTop: 8, color: "#6b7280" }}>
              {election.totalVotes
                ? `Votes: ${election.totalVotes}`
                : "No votes yet"}
            </div>
          ) : (
            // closed & user not voted
            <div style={{ marginTop: 8, color: "#b91c1c" }}>
              Election closed — you did not vote.
              {typeof election.totalVotes !== "undefined" && (
                <span style={{ marginLeft: 12 }}>
                  Votes: {election.totalVotes}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {/* If user hasn't voted and election is open -> Vote */}
        {!hasVoted && isOpen ? (
          <button
            className="btn btn-primary"
            onClick={() => setOpen(true)}
            disabled={busy}
          >
            {busy ? "Please wait..." : "Vote"}
          </button>
        ) : (
          // Otherwise provide View (detail), clickable in all other cases
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
