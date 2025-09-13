// frontend/src/components/VoteModal.jsx
import React, { useState, useEffect } from "react";

/**
 * More descriptive labels for score 1..5:
 * 1 = Strongly Disagree
 * 2 = Disagree
 * 3 = Neutral
 * 4 = Agree
 * 5 = Strongly Agree
 */
const SCORE_LABELS = {
  1: "Strongly Disagree",
  2: "Disagree",
  3: "Neutral",
  4: "Agree",
  5: "Strongly Agree",
};

export default function VoteModal({
  isOpen,
  onClose,
  election = {},
  onSubmitVote,
}) {
  const [score, setScore] = useState(5);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setScore(5);
      setBusy(false);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isOpenStatus =
    String(election.status || "open").toLowerCase() === "open";

  const handleSubmit = async () => {
    if (!isOpenStatus) {
      setError("This election is closed — voting is not allowed.");
      return;
    }
    if (!Number.isInteger(score) || score < 1 || score > 5) {
      setError("Please select a score between 1 and 5.");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      await onSubmitVote(score);
      onClose();
    } catch (err) {
      const msg =
        err?.message || err?.error?.message || "Failed to submit vote";
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop" style={{ zIndex: 999 }}>
      <div className="modal">
        <div className="modal-header">
          <h3>Vote on Transaction</h3>
          <button className="btn btn-outline" onClick={onClose} disabled={busy}>
            Close
          </button>
        </div>

        <div className="modal-body">
          <div style={{ marginBottom: 8 }}>
            <strong>TxHash:</strong>
            <div
              className="code-box"
              style={{ marginTop: 6, wordBreak: "break-all" }}
            >
              {election.txHash}
            </div>
          </div>

          {election.txSummary && (
            <div style={{ marginBottom: 8 }}>
              <strong>From:</strong> {election.txSummary.from} <br />
              <strong>To:</strong> {election.txSummary.to || "—"} <br />
              <strong>Value:</strong> {election.txSummary.valueEth ?? "0"} ETH{" "}
              <br />
              <strong>Type:</strong> {election.txSummary.type || "unknown"}
            </div>
          )}

          <div style={{ marginTop: 12 }}>
            <label>
              <strong>Your confidence</strong>
            </label>
            <div style={{ marginTop: 8, marginBottom: 6, color: "#374151" }}>
              Pick a score (1..5). Higher = more confident this transaction is
              valid/acceptable.
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`btn ${
                    score === n ? "btn-primary" : "btn-outline"
                  }`}
                  onClick={() => setScore(n)}
                  disabled={busy}
                >
                  <div style={{ fontWeight: 700 }}>{n}</div>
                  <div style={{ fontSize: 11 }}>{SCORE_LABELS[n]}</div>
                </button>
              ))}
            </div>
          </div>

          <p style={{ marginTop: 12, color: "#6b7280" }}>
            After voting you will be prevented from voting again for this
            election.
          </p>

          {error && (
            <div style={{ marginTop: 12, color: "crimson", fontWeight: 600 }}>
              {error}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={busy}
          >
            {busy ? "Submitting..." : "Submit Vote"}
          </button>
        </div>
      </div>
    </div>
  );
}
