import React, { useState, useEffect } from "react";
import AuthContext from "./authContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const walletAddress = localStorage.getItem("walletAddress");
    const name = localStorage.getItem("userName");
    if (token && walletAddress) {
      setUser({ walletAddress, token, name: name || null });
    }
  }, []);

  const login = (walletAddress, token, name = null) => {
    localStorage.setItem("token", token);
    localStorage.setItem("walletAddress", walletAddress);
    if (name) localStorage.setItem("userName", name);
    setUser({ walletAddress, token, name });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("userName");
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
