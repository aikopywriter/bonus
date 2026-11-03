import { load, save, remove } from './storage';

export function getAuth() {
  const a = load('auth', null);
  if (!a || !a.token || !a.exp || a.exp < Date.now()) return null;
  return a;
}

export function setAuth(auth) {
  save('auth', auth);
}

export function logout() {
  remove('auth');
  window.location.href = '/';
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function api(path, body, { timeout = 45000 } = {}) {
  const auth = getAuth();
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  let res;
  try {
    res = await fetch(`/api/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(auth ? { Authorization: `Bearer ${auth.token}` } : {}),
      },
      body: JSON.stringify(body || {}),
      signal: ctrl.signal,
    });
  } catch (e) {
    clearTimeout(t);
    throw new ApiError(
      e.name === 'AbortError' ? 'This is taking too long. Please try again.' : 'Network problem. Check your internet connection and try again.',
      0
    );
  }
  clearTimeout(t);
  let data = null;
  try { data = await res.json(); } catch { /* non-JSON */ }
  if (res.status === 401 && path !== 'auth') {
    remove('auth');
    window.location.href = '/';
  }
  if (!res.ok) throw new ApiError(data?.error || 'Something went wrong. Please try again.', res.status, data);
  return data;
}
