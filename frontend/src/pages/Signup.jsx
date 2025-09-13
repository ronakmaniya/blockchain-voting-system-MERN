// frontend/src/pages/Signup.jsx
import React, { useState } from "react";
import { signup as apiSignup } from "../utils/api";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiSignup(name, walletAddress);
      if (res.nonce) {
        const from = location?.state?.from?.pathname || "/dashboard";
        navigate("/verify", {
          state: { walletAddress, nonce: res.nonce, name, from },
        });
      } else {
        setError(res.error || res.message || "Signup failed");
      }
    } catch (err) {
      console.error("signup error", err);
      setError("Network error during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div style={{ textAlign: "center", marginBottom: "var(--space-6)" }}>
        <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>
          ✨
        </div>
        <h2 className="form-title">Create Account</h2>
        <p className="form-subtitle">Join the blockchain voting community</p>
      </div>

      {error && <div className="form-error">⚠️ {error}</div>}

      <form onSubmit={handleSignup}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            className="form-input"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="walletAddress">
            Wallet Address
          </label>
          <input
            id="walletAddress"
            type="text"
            className="form-input"
            placeholder="0x..."
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className={`btn btn-secondary btn-lg ${loading ? "btn-loading" : ""}`}
          disabled={loading}
          style={{ width: "100%" }}
        >
          {loading ? "Creating account..." : "🚀 Create Account"}
        </button>
      </form>

      <div
        style={{
          textAlign: "center",
          marginTop: "var(--space-8)",
          padding: "var(--space-6)",
          background: "var(--gray-50)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--gray-200)",
        }}
      >
        <p style={{ margin: "0 0 var(--space-4) 0", color: "var(--gray-600)" }}>
          Already have an account?
        </p>
        <Link to="/login" className="btn btn-outline">
          🔑 Sign In Instead
        </Link>
      </div>
    </div>
  );
}
