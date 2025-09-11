import React, { useState } from "react";
import { signup as apiSignup } from "../api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await apiSignup(name, walletAddress);
      if (res.nonce) {
        navigate("/verify", {
          state: { walletAddress, nonce: res.nonce, name },
        });
      } else {
        alert(res.error || res.message || "Signup failed");
      }
    } catch (err) {
      alert(err, "Network error");
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
