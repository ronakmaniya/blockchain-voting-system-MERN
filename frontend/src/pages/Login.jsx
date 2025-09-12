// src/pages/Login.jsx
import React, { useState } from "react";
import { login as apiLogin } from "../api";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const [walletAddress, setWalletAddress] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await apiLogin(walletAddress);
      if (res.nonce) {
        const from = location?.state?.from?.pathname || "/dashboard";
        navigate("/verify", {
          state: { walletAddress, nonce: res.nonce, from },
        });
      } else {
        alert(res.error || res.message || "Login failed");
      }
    } catch (err) {
      console.error("login error", err);
      alert("Network error during login");
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      {location?.state?.from && (
        <p className="muted">
          You must login to view {location.state.from.pathname}
        </p>
      )}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Wallet Address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
