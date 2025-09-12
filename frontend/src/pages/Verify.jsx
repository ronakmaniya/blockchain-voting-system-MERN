// src/pages/Verify.jsx
import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verify as apiVerify } from "../api";
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

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  if (!walletAddress || !nonce) {
    return <p>Invalid flow. Please login or signup first.</p>;
  }

  // Generate signature using private key (in-browser)
  const handleGenerateFromPK = async () => {
    if (!privateKey) {
      return alert("Paste your private key to generate signature.");
    }
    setBusy(true);
    try {
      const sig = await signWithPrivateKey(privateKey, nonce);
      setGeneratedSig(sig);
      setSignature(sig); // auto-fill into the signature field
      // Clear private key from state immediately to reduce risk
      setPrivateKey("");
      // Small UX: focus signature input (if desired) — kept simple for now
    } catch (err) {
      console.error(err);
      alert("Failed to sign with private key: " + (err.message || err));
    } finally {
      setBusy(false);
    }
  };

  const handleUseGenerated = () => {
    if (!generatedSig) return alert("No generated signature");
    setSignature(generatedSig);
  };

  // Final verify submit
  const handleVerify = async (e) => {
    e.preventDefault();
    if (!signature)
      return alert("Please provide a signature (generate or paste).");

    setBusy(true);
    try {
      const res = await apiVerify(walletAddress, signature);

      if (res.token) {
        // Prefer name returned from backend; fallback to name from state (signup)
        const returnedName = res.name || nameFromState || null;
        login(walletAddress, res.token, returnedName);
        navigate("/dashboard");
      } else {
        alert(res.error || res.message || "Verification failed");
      }
    } catch (err) {
      console.error("Verify error:", err);
      alert("Network error during verify");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Verify Wallet</h2>

      <div style={{ marginBottom: 12 }}>
        <strong>Address:</strong> {walletAddress}
      </div>

      <div style={{ marginBottom: 12 }}>
        <strong>Nonce:</strong>
        <div
          style={{
            wordBreak: "break-all",
            background: "#f3f4f6",
            padding: 8,
            borderRadius: 6,
            marginTop: 6,
          }}
        >
          {nonce}
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <p style={{ color: "#b91c1c", fontSize: 13 }}>
          Security note: never send private keys to the backend. If you paste
          your private key here it will be used only in your browser to sign the
          nonce and will be cleared from the input immediately after signing.
          Use test accounts (Ganache) for development.
        </p>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>
          <strong>Private key (required to generate signature)</strong>
        </label>
        <input
          type="password"
          placeholder="Paste 0x... private key here (will be cleared after signing)"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
          style={{ width: "100%", padding: 8, marginTop: 6 }}
        />
        <button
          type="button"
          onClick={handleGenerateFromPK}
          disabled={busy}
          style={{ marginTop: 8 }}
        >
          {busy ? "Signing..." : "Generate signature (from private key)"}
        </button>
      </div>

      <hr style={{ margin: "16px 0" }} />

      <div style={{ marginBottom: 8 }}>
        <label>
          <strong>Generated signature</strong>
        </label>
        <textarea
          rows={3}
          readOnly
          value={generatedSig}
          style={{ width: "100%", padding: 8, marginTop: 6 }}
        />
        <div style={{ marginTop: 6 }}>
          <button type="button" onClick={handleUseGenerated}>
            Use generated signature
          </button>
          <button
            type="button"
            onClick={() => {
              if (!generatedSig) return alert("No signature to copy");
              navigator.clipboard
                ?.writeText(generatedSig)
                .then(() => alert("Signature copied to clipboard"));
            }}
            style={{ marginLeft: 8 }}
          >
            Copy signature
          </button>
        </div>
      </div>

      <form onSubmit={handleVerify}>
        <div style={{ marginBottom: 8 }}>
          <label>
            <strong>Or paste signature here</strong>
          </label>
          <input
            type="text"
            placeholder="Paste your signature here"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
            required
          />
        </div>

        <button type="submit" disabled={busy}>
          {busy ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}
