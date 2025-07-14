export async function loginUser(username: string, password: string) {
  const res = await fetch('http://localhost:5000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.msg || 'Login failed');
  // Return the inner data object, which contains access_token and user
  return data.data;
}

export async function signupUser(username: string, password: string, plan: string) {
  const res = await fetch('http://localhost:5000/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, plan })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.msg || 'Signup failed');
  // Return the inner data object
  return data.data;
}

export async function getMe() {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:5000/api/me', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Auth check failed');
  return data;
} 