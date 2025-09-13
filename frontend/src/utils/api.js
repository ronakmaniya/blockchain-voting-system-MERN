// frontend/src/utils/api.js
const API_URL = "http://localhost:5000/api"; // change if backend runs elsewhere

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

export async function getElections({
  token = null,
  page = 1,
  limit = 100,
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

export async function postVote(electionId, score, token = null) {
  const url = `${API_URL}/elections/${electionId}/vote`;
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ score }),
  });

  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      error: payload || { message: "Unknown error" },
    };
  }

  return { ok: true, data: payload };
}
