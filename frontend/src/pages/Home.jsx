// src/pages/Home.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../contexts/authContext";

export default function Home() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="home">
      <div className="home-card">
        <h1 className="home-title">Welcome to the Blockchain Voting System</h1>
        <p className="home-desc">
          Track blockchain transactions and let the network vote on their
          validity — secure, auditable, and user-driven.
        </p>

        <div className="home-actions">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn btn-primary large">
                Login
              </Link>
              <Link to="/signup" className="btn btn-secondary large">
                Signup
              </Link>
            </>
          ) : (
            <Link to="/dashboard" className="btn btn-primary large">
              Go to Dashboard
            </Link>
          )}
        </div>

        <div className="home-tip">
          Tip: Use test accounts (Ganache) for development.
        </div>
      </div>
    </div>
  );
}
