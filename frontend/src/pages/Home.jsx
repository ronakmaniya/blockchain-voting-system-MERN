// frontend/src/pages/Home.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../contexts/authContext";

export default function Home() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="home">
      <div className="home-card">
        <h1 className="home-title">🗳️ Blockchain Voting System</h1>
        <p className="home-desc">
          Experience the future of democratic decision-making with our secure,
          transparent, and auditable blockchain-based voting platform. Cast your
          votes on blockchain transactions and participate in decentralized
          governance.
        </p>

        <div className="home-actions">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn btn-primary btn-lg">
                🔐 Login
              </Link>
              <Link to="/signup" className="btn btn-secondary btn-lg">
                ✨ Sign Up
              </Link>
            </>
          ) : (
            <Link to="/dashboard" className="btn btn-primary btn-xl">
              📊 Go to Dashboard
            </Link>
          )}
        </div>

        <div className="home-tip">
          💡 <strong>Getting Started:</strong> Use test accounts (Ganache) for
          development and testing.
        </div>

        <div style={{ marginTop: "var(--space-6)" }}>
          <Link to="/about" className="btn btn-ghost">
            ℹ️ Learn More About This Project
          </Link>
        </div>
      </div>
    </div>
  );
}
