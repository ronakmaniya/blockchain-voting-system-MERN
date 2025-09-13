// frontend/src/pages/Verify.jsx
import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verify as apiVerify } from "../utils/api";
import AuthContext from "../contexts/authContext";
import { signWithPrivateKey } from "../utils/signMessageClient";

export default function Verify() {
  const location = useLocation();
  const { state } = location || {};
  const walletAddress = state?.walletAddress;
  const nonce = state?.nonce;
  const nameFromState = state?.name || null;

  const [privateKey, setPrivateKey] = useState("");
  const [generatedSig, setGeneratedSig] = useState("");
  const [signature, setSignature] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  if (!walletAddress || !nonce) {
    return (
      <div className="form-container">
        <div style={{ textAlign: "center", padding: "var(--space-8)" }}>
          <div
            style={{
              color: "var(--error-600)",
              fontSize: "3rem",
              marginBottom: "var(--space-4)",
            }}
          >
            ⚠️
          </div>
          <h2
            style={{
              color: "var(--error-600)",
              marginBottom: "var(--space-2)",
            }}
          >
            Invalid Flow
          </h2>
          <p style={{ color: "var(--gray-600)" }}>
            Please login or signup first.
          </p>
        </div>
      </div>
    );
  }

  const handleGenerateFromPK = async () => {
    if (!privateKey) {
      setError("Paste your private key to generate signature.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const sig = await signWithPrivateKey(privateKey, nonce);
      setGeneratedSig(sig);
      setSignature(sig);
      setPrivateKey("");
    } catch (err) {
      console.error(err);
      setError("Failed to sign with private key: " + (err.message || err));
    } finally {
      setBusy(false);
    }
  };

  const handleUseGenerated = () => {
    if (!generatedSig) {
      setError("No generated signature");
      return;
    }
    setSignature(generatedSig);
    setError("");
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!signature) {
      setError("Please provide a signature (generate or paste).");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const res = await apiVerify(walletAddress, signature);

      if (res.token) {
        const returnedName = res.name || nameFromState || null;
        // save token + wallet + name
        login(walletAddress, res.token, returnedName);

        // Redirect TO HOME (user asked that verify should redirect to Home,
        // so they can click 'Go to Dashboard' themselves)
        navigate("/", { replace: true });
      } else {
        setError(res.error || res.message || "Verification failed");
      }
    } catch (err) {
      console.error("Verify error:", err);
      setError("Network error during verify");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="form-container">
      <div style={{ textAlign: "center", marginBottom: "var(--space-6)" }}>
        <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>
          🔐
        </div>
        <h2 className="form-title">Verify Your Wallet</h2>
        <p className="form-subtitle">
          Complete the verification process to access your account
        </p>
      </div>

      <div
        style={{
          padding: "var(--space-4)",
          background: "var(--gray-50)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--gray-200)",
          marginBottom: "var(--space-6)",
        }}
      >
        <div style={{ marginBottom: "var(--space-3)" }}>
          <strong style={{ color: "var(--gray-700)" }}>Wallet Address:</strong>
          <div className="code-box" style={{ marginTop: "var(--space-1)" }}>
            {walletAddress}
          </div>
        </div>

        <div>
          <strong style={{ color: "var(--gray-700)" }}>Nonce to Sign:</strong>
          <div className="code-box" style={{ marginTop: "var(--space-1)" }}>
            {nonce}
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "var(--space-4)",
          background: "var(--warning-50)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--warning-200)",
          marginBottom: "var(--space-6)",
        }}
      >
        <p
          style={{
            color: "var(--warning-700)",
            margin: 0,
            fontSize: "0.875rem",
            lineHeight: 1.5,
          }}
        >
          <strong>🔒 Security Note:</strong> Your private key is processed only
          in your browser and never sent to our servers. It will be cleared
          immediately after signing. Use test accounts (Ganache) for
          development.
        </p>
      </div>

      {error && <div className="form-error">⚠️ {error}</div>}

      <div className="form-group">
        <label className="form-label" htmlFor="privateKey">
          Private Key (to generate signature)
        </label>
        <input
          id="privateKey"
          type="password"
          className="form-input"
          placeholder="Paste 0x... private key here (will be cleared after signing)"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
          disabled={busy}
        />
        <button
          type="button"
          className={`btn btn-outline ${busy ? "btn-loading" : ""}`}
          onClick={handleGenerateFromPK}
          disabled={busy || !privateKey}
          style={{ marginTop: "var(--space-2)" }}
        >
          {busy ? "Signing..." : "🔑 Generate Signature"}
        </button>
      </div>

      {generatedSig && (
        <div className="form-group">
          <label className="form-label">Generated Signature</label>
          <textarea
            rows={3}
            className="form-input"
            readOnly
            value={generatedSig}
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}
          />
          <div
            style={{
              display: "flex",
              gap: "var(--space-2)",
              marginTop: "var(--space-2)",
            }}
          >
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleUseGenerated}
            >
              ✅ Use This Signature
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                if (!generatedSig) return alert("No signature to copy");
                navigator.clipboard
                  ?.writeText(generatedSig)
                  .then(() => alert("Signature copied to clipboard!"));
              }}
            >
              📋 Copy
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleVerify}>
        <div className="form-group">
          <label className="form-label" htmlFor="signature">
            Or paste signature here
          </label>
          <input
            id="signature"
            type="text"
            className="form-input"
            placeholder="Paste your signature here"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            required
            disabled={busy}
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}
          />
        </div>

        <button
          type="submit"
          className={`btn btn-primary btn-lg ${busy ? "btn-loading" : ""}`}
          disabled={busy || !signature}
          style={{ width: "100%" }}
        >
          {busy ? "Verifying..." : "✅ Complete Verification"}
        </button>
      </form>
    </div>
  );
}
