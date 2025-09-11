import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verify as apiVerify } from "../api";
import AuthContext from "../contexts/authContext";

export default function Verify() {
  const location = useLocation();
  const { state } = location || {};
  const walletAddress = state?.walletAddress;
  const nonce = state?.nonce;
  // optional name passed from signup flow
  const stateName = state?.name || null;

  const [signature, setSignature] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  if (!walletAddress || !nonce) {
    return <p>Invalid flow. Please login or signup first.</p>;
  }

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await apiVerify(walletAddress, signature);

      // Expecting backend to return { token, walletAddress, name? }
      if (res.token) {
        // Prefer name returned from backend; fallback to name from state (signup)
        const returnedName = res.name || stateName || null;

        // Save token + wallet + name to Auth (and localStorage)
        login(walletAddress, res.token, returnedName);

        // redirect to dashboard or wherever
        navigate("/dashboard");
      } else {
        // API returned no token -> error message
        alert(res.error || res.message || "Verification failed");
      }
    } catch (err) {
      console.error("Verify error:", err);
      alert("Network error during verify");
    }
  };

  return (
    <div className="form-container">
      <h2>Verify Wallet</h2>
      <p>
        Nonce: <b>{nonce}</b>
      </p>
      <form onSubmit={handleVerify}>
        <input type="hidden" value={walletAddress} readOnly />
        <input
          type="text"
          placeholder="Paste your signature here"
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          required
        />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
}
