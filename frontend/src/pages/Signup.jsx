// src/pages/Signup.jsx
import React, { useState } from "react";
import { signup as apiSignup } from "../api";
import { useNavigate, useLocation } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await apiSignup(name, walletAddress);
      if (res.nonce) {
        const from = location?.state?.from?.pathname || "/dashboard";
        navigate("/verify", {
          state: { walletAddress, nonce: res.nonce, name, from },
        });
      } else {
        alert(res.error || res.message || "Signup failed");
      }
    } catch (err) {
      console.error("signup error", err);
      alert("Network error during signup");
    }
  };

  return (
    <div className="form-container">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Wallet Address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          required
        />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}
