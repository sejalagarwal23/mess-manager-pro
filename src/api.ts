const API_BASE = "http://localhost:5000/api"; 
// Later your teammate will give real URL

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return res.json();
};

export const registerUser = async (name: string, email: string, password: string) => {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  return res.json();
};