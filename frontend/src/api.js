const API_URL = "http://localhost:5000/api";

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
