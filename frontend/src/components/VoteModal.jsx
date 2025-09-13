// frontend/src/components/VoteModal.jsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

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

const SCORE_EMOJIS = {
  1: "😞",
  2: "😐",
  3: "😑",
  4: "😊",
  5: "😍",
};

const SCORE_COLORS = {
  1: "var(--error-500)",
  2: "var(--warning-500)",
  3: "var(--gray-500)",
  4: "var(--success-500)",
  5: "var(--primary-500)",
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

    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
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

  const modalContent = (
    <div
      className="modal-backdrop"
      style={{
        zIndex: 9999,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">🗳️ Cast Your Vote</h3>
          <button className="modal-close" onClick={onClose} disabled={busy}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="transaction-summary">
            <div className="transaction-hash">
              <strong>Transaction:</strong>
              <div className="code-box">{election.txHash}</div>
            </div>

            {election.txSummary && (
              <div className="transaction-details">
                <div className="detail-item">
                  <span className="detail-label">From:</span>
                  <span className="code-inline">{election.txSummary.from}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">To:</span>
                  <span className="code-inline">
                    {election.txSummary.to || "—"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Value:</span>
                  <span className="code-inline">
                    {election.txSummary.valueEth ?? "0"} ETH
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Type:</span>
                  <span className="code-inline">
                    {election.txSummary.type || "unknown"}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="voting-section">
            <h3 className="voting-title">Rate Your Confidence</h3>
            <p className="voting-description">
              How confident are you that this transaction is legitimate? Choose
              from 1 (not confident) to 5 (very confident).
            </p>

            <div className="voting-scale-container">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`voting-option ${score === n ? "selected" : ""}`}
                  onClick={() => setScore(n)}
                  disabled={busy}
                  data-score={n}
                >
                  <div className="voting-emoji">{SCORE_EMOJIS[n]}</div>
                  <div className="voting-number">{n}</div>
                  <div className="voting-label">{SCORE_LABELS[n]}</div>
                </button>
              ))}
            </div>

            {score && (
              <div className="selection-confirmation">
                <div className="selection-text">
                  Selected: {SCORE_EMOJIS[score]} Score {score} -{" "}
                  {SCORE_LABELS[score]}
                </div>
              </div>
            )}
          </div>

          <div className="voting-warning">
            <p>
              ⚠️ <strong>Important:</strong> You can only vote once per
              election. Your vote cannot be changed after submission.
            </p>
          </div>

          {error && (
            <div
              className="form-error"
              style={{ marginBottom: "var(--space-4)" }}
            >
              ⚠️ {error}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button
            className={`btn btn-primary btn-lg ${busy ? "btn-loading" : ""}`}
            onClick={handleSubmit}
            disabled={busy || !score}
          >
            {busy ? "Submitting Vote..." : "🗳️ Submit Vote"}
          </button>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return createPortal(modalContent, document.body);
}
