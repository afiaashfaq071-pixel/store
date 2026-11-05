// Minimal Supabase client using plain fetch (no extra npm package needed).
// Reads VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from the .env file.
// When they are empty the whole site falls back to browser-only storage.
import { loadFromStorage, removeFromStorage, saveToStorage } from '../utils/storage.js';

const BASE = String(import.meta.env.VITE_SUPABASE_URL || '').trim().replace(/\/+$/, '');
const ANON = String(import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseEnabled = Boolean(BASE && ANON);

const SESSION_KEY = 'ahs_sb_session_v1';
let session = loadFromStorage(SESSION_KEY, null);

export const hasSession = () => Boolean(session && session.access_token && (session.expires_at > Date.now() || session.refresh_token));

const store = (data) => {
  session = { access_token: data.access_token, refresh_token: data.refresh_token, expires_at: Date.now() + (data.expires_in || 3600) * 1000 };
  saveToStorage(SESSION_KEY, session);
};

const clearSession = () => {
  session = null;
  removeFromStorage(SESSION_KEY);
};

const authCall = async (grant, body) => {
  const res = await fetch(`${BASE}/auth/v1/token?grant_type=${grant}`, {
    method: 'POST',
    headers: { apikey: ANON, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error_description || data.msg || `Login failed (${res.status})`);
  return data;
};

/** Owner login with the email + password created in Supabase -> Authentication -> Users. */
export const signIn = async (email, password) => {
  store(await authCall('password', { email: email.trim(), password }));
};

export const signOut = () => {
  clearSession();
};

const freshToken = async () => {
  if (!session) return null;
  if (session.expires_at - 30000 > Date.now()) return session.access_token;
  try {
    store(await authCall('refresh_token', { refresh_token: session.refresh_token }));
    return session.access_token;
  } catch {
    clearSession();
    window.dispatchEvent(new Event('ahs-session-expired'));
    return null;
  }
};

/**
 * Calls the Supabase REST API (PostgREST). Example: api('products?select=*&order=created_at.desc').
 * Uses the owner's login when signed in, otherwise the public (anon) key.
 * Resolves with parsed JSON (or null for empty answers) and throws an Error on failure.
 */
export const api = async (path, { method = 'GET', body, prefer } = {}) => {
  if (!isSupabaseEnabled) throw new Error('Supabase is not configured');
  const token = await freshToken();
  const headers = { apikey: ANON, 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  else if (ANON.startsWith('eyJ')) headers.Authorization = `Bearer ${ANON}`;
  if (prefer) headers.Prefer = prefer;

  const res = await fetch(`${BASE}/rest/v1/${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  const text = await res.text();
  if (!res.ok) {
    let message = text;
    try {
      message = JSON.parse(text).message || text;
    } catch {
      /* keep raw text */
    }
    throw new Error(message || `Database error ${res.status}`);
  }
  return text ? JSON.parse(text) : null;
};
