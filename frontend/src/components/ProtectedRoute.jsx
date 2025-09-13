// frontend/src/components/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "../contexts/authContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loggedOut } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) {
    // If user just clicked logout → always go Home
    if (loggedOut) {
      return <Navigate to="/" replace />;
    }
    // Otherwise (direct access attempt) → go to Login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
