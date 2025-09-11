import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../contexts/authContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const loc = useLocation();

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

          {!isAuthenticated ? (
            <>
              {loc.pathname === "/login" ? (
                <Link to="/signup" className="btn btn-primary">
                  Signup
                </Link>
              ) : loc.pathname === "/signup" ? (
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline">
                    Login
                  </Link>
                  <Link to="/signup" className="btn btn-primary">
                    Signup
                  </Link>
                </>
              )}
            </>
          ) : (
            <>
              <span className="user-greet">
                Hi{user?.name ? `, ${user.name}` : ""}
              </span>
              <button onClick={logout} className="btn btn-danger">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
