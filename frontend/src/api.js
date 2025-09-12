// src/api.js
const API_URL = "http://localhost:5000/api"; // change if backend on different host/port

export async function signup(name, walletAddress) {
  const res = await fetch(`${API_URL}/auth/signup-request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, walletAddress }),
  });
  return res.json();
}

export async function login(walletAddress) {
  const res = await fetch(`${API_URL}/auth/login-request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress }),
  });
  return res.json();
}

export async function verify(walletAddress, signature) {
  const res = await fetch(`${API_URL}/auth/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress, signature }),
  });
  return res.json();
}

/* Optional: elections endpoints for later */
export async function getElections({
  token = null,
  page = 1,
  limit = 50,
} = {}) {
  const url = `${API_URL}/elections?page=${page}&limit=${limit}`;
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  return res.json();
}

export async function getElection(id, token = null) {
  const url = `${API_URL}/elections/${id}`;
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  return res.json();
}
