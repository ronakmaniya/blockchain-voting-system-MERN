// frontend/src/contexts/AuthProvider.jsx
import React, { useState, useMemo, useCallback } from "react";
import AuthContext from "./authContext";

/**
 * loadInitialUser() reads localStorage synchronously so protected routes
 * don't redirect during the first render.
 */
function loadInitialUser() {
  try {
    const token = localStorage.getItem("token");
    const walletAddress = localStorage.getItem("walletAddress");
    const name = localStorage.getItem("userName");
    if (token && walletAddress) {
      return { token, walletAddress, name: name || null };
    }
    return null;
  } catch {
    // intentionally ignore errors reading localStorage
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadInitialUser);
  const [loggedOut, setLoggedOut] = useState(false);

  const login = useCallback((walletAddress, token, name = null) => {
    try {
      localStorage.setItem("token", token);
      localStorage.setItem("walletAddress", walletAddress);
      if (name) localStorage.setItem("userName", name);
    } catch {
      // ignore localStorage errors (e.g., private mode)
    }
    setUser({ walletAddress, token, name });
    setLoggedOut(false); // reset loggedOut flag on login
  }, []);

  const logout = useCallback((explicit = false) => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("walletAddress");
      localStorage.removeItem("userName");
    } catch {
      // ignore
    }
    setUser(null);
    setLoggedOut(explicit); // true if user clicked logout, false if expired
  }, []);

  const isAuthenticated = useMemo(() => !!user, [user]);

  const contextValue = useMemo(
    () => ({ user, login, logout, isAuthenticated, loggedOut }),
    [user, login, logout, isAuthenticated, loggedOut]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export default AuthProvider;
