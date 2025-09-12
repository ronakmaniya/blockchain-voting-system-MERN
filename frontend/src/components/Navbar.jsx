// src/components/Navbar.jsx
import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../contexts/authContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const loc = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear auth state
    logout(true); // pass "true" to mark explicit logout
    // ensure the user lands on the Home page
    navigate("/", { replace: true });
  };

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand">
          Blockchain Voting
        </Link>

        <div className="nav-right">
          <Link
            to="/"
            className={loc.pathname === "/" ? "nav-link active" : "nav-link"}
          >
            Home
          </Link>

          {/* Dashboard only visible when authenticated */}
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className={
                loc.pathname === "/dashboard" ? "nav-link active" : "nav-link"
              }
            >
              Dashboard
            </Link>
          )}

          {/* Right side: when authenticated show greeting + logout; otherwise nothing */}
          {isAuthenticated ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className="user-greet">
                Hi{user?.name ? `, ${user.name}` : ""}
              </span>
              <button onClick={handleLogout} className="btn btn-danger">
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
