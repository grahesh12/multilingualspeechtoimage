export async function loginUser(username: string, password: string) {
  const res = await fetch('http://localhost:5000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || 'Login failed');
  return data;
}

export async function signupUser(username: string, password: string, plan: string) {
  const res = await fetch('http://localhost:5000/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, plan })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || 'Signup failed');
  return data;
} 