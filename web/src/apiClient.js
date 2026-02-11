// Minimal API client for backend requests
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function getApiUrl(path) {
  let base = API_BASE;
  if (base.endsWith('/')) base = base.slice(0, -1);
  if (!path.startsWith('/')) path = '/' + path;
  return base + path;
}

export async function apiGet(path) {
  try {
    const res = await fetch(getApiUrl(path));
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    throw err;
  }
}

export async function apiPost(path, body) {
  try {
    const res = await fetch(getApiUrl(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      let errMsg = `POST ${path} failed: ${res.status}`;
      try { const data = await res.json(); errMsg = data.error || errMsg; } catch {}
      throw new Error(errMsg);
    }
    return await res.json();
  } catch (err) {
    throw err;
  }
}
