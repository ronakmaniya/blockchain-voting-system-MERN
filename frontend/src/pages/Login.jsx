// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import { login as apiLogin } from "../utils/api";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function Login() {
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiLogin(walletAddress);
      if (res.nonce) {
        const from = location?.state?.from?.pathname || "/dashboard";
        navigate("/verify", {
          state: { walletAddress, nonce: res.nonce, from },
        });
      } else {
        setError(res.error || res.message || "Login failed");
      }
    } catch (err) {
      console.error("login error", err);
      setError("Network error during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div style={{ textAlign: "center", marginBottom: "var(--space-6)" }}>
        <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>
          🔐
        </div>
        <h2 className="form-title">Welcome Back</h2>
        <p className="form-subtitle">
          Sign in to your blockchain voting account
        </p>
      </div>

      {location?.state?.from && (
        <div
          style={{
            padding: "var(--space-4)",
            background: "var(--warning-50)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--warning-200)",
            marginBottom: "var(--space-6)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "var(--warning-700)",
              margin: 0,
              fontWeight: "500",
            }}
          >
            ⚠️ You must login to view {location.state.from.pathname}
          </p>
        </div>
      )}

      {error && <div className="form-error">⚠️ {error}</div>}

      <form onSubmit={handleLogin}>
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
          className={`btn btn-primary btn-lg ${loading ? "btn-loading" : ""}`}
          disabled={loading}
          style={{ width: "100%" }}
        >
          {loading ? "Signing in..." : "🔑 Sign In"}
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
          Don't have an account?
        </p>
        <Link to="/signup" className="btn btn-outline">
          ✨ Create New Account
        </Link>
      </div>
    </div>
  );
}
