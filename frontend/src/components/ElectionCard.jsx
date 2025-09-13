// frontend/src/components/ElectionCard.jsx
import React, { useState } from "react";
import VoteModal from "./VoteModal";
import { Link } from "react-router-dom";

function StatusBadge({ status }) {
  const s = status?.toLowerCase?.() || "unknown";

  if (s === "open") {
    return <span className="election-status active">🟢 Active</span>;
  } else if (s === "closed") {
    return <span className="election-status closed">🔴 Closed</span>;
  } else {
    return <span className="election-status pending">🟡 Pending</span>;
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
    <div className="election-card">
      <div className="election-card-header">
        <h3 className="election-card-title">
          {election.title ||
            `Election for ${election.txHash?.slice(0, 10) ?? election._id}`}
        </h3>
        <p className="election-card-description">
          Transaction: <span className="code-inline">{election.txHash}</span>
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "var(--space-3)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
            }}
          >
            <span className="muted">
              📅 Created: {new Date(election.createdAt).toLocaleString()}
            </span>
            {/* Show analytics indicator */}
            {(election.status?.toLowerCase() === "closed" || hasVoted) && (
              <span className="analytics-indicator" title="Analytics available">
                📊
              </span>
            )}
          </div>
          <StatusBadge status={election.status} />
        </div>
      </div>

      <div className="election-card-body">
        <div className="election-stats">
          <div className="stat-item">
            <span className="stat-value">{election.totalVotes || 0}</span>
            <span className="stat-label">Total Votes</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {hasVoted ? userInfo.score : "—"}
            </span>
            <span className="stat-label">Your Vote</span>
          </div>
          {/* Show analytics if: election is closed OR user has voted */}
          {(election.status?.toLowerCase() === "closed" || hasVoted) && (
            <div className="stat-item analytics-item">
              <span className="stat-value">
                {typeof election.averageScore !== "undefined"
                  ? Number(election.averageScore).toFixed(2)
                  : "—"}
              </span>
              <span className="stat-label">Average Score</span>
            </div>
          )}
        </div>

        {hasVoted ? (
          <div
            style={{
              padding: "var(--space-4)",
              background: "var(--success-50)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--success-200)",
              textAlign: "center",
            }}
          >
            <div style={{ color: "var(--success-700)", fontWeight: "600" }}>
              ✅ You voted with score: <strong>{userInfo.score}</strong>
            </div>
          </div>
        ) : isOpen ? (
          <div
            style={{
              padding: "var(--space-4)",
              background: "var(--warning-50)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--warning-200)",
              textAlign: "center",
            }}
          >
            <div style={{ color: "var(--warning-700)", fontWeight: "600" }}>
              ⏰{" "}
              {election.totalVotes
                ? `${election.totalVotes} votes cast`
                : "No votes yet"}{" "}
              • Cast your vote now!
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: "var(--space-4)",
              background: "var(--error-50)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--error-200)",
              textAlign: "center",
            }}
          >
            <div style={{ color: "var(--error-700)", fontWeight: "600" }}>
              ❌ Election closed • You did not vote
            </div>
          </div>
        )}
      </div>

      <div className="election-card-footer">
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              navigator.clipboard
                ?.writeText(election.txHash)
                .then(() => alert("Transaction hash copied to clipboard!"));
            }}
            disabled={busy}
            title="Copy transaction hash"
          >
            📋 Copy Hash
          </button>
        </div>

        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          {!hasVoted && isOpen ? (
            <button
              className="btn btn-primary"
              onClick={() => setOpen(true)}
              disabled={busy}
            >
              {busy ? (
                <>
                  <span className="loading-spinner"></span>
                  Please wait...
                </>
              ) : (
                "🗳️ Vote Now"
              )}
            </button>
          ) : (
            <Link to={`/elections/${election._id}`} className="btn btn-outline">
              👁️ View Details
            </Link>
          )}
        </div>
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
