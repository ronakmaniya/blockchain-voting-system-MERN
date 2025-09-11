import React, { useState } from "react";
import { login as apiLogin } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [walletAddress, setWalletAddress] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await apiLogin(walletAddress);
      if (res.nonce) {
        navigate("/verify", { state: { walletAddress, nonce: res.nonce } });
      } else {
        alert(res.error || res.message || "Login failed");
      }
    } catch (err) {
      alert(err, "Network error");
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
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
