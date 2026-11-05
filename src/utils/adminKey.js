// Owner key for the admin area.
// NOTE: there is no server, so the key is checked inside the browser. It keeps ordinary
// visitors out of /admin, but it is not bank-grade security. Real protection needs a backend.
import { loadFromStorage, saveToStorage } from './storage.js';

const KEY_STORAGE = 'ahs_admin_key_v1';
const SESSION = 'ahs_admin_unlocked_v1';

// Small non-cryptographic string hash (cyrb53) so the key is not stored as plain text.
const hash = (str, seed = 7) => {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i += 1) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return String(4294967296 * (2097151 & h2) + (h1 >>> 0));
};

export const MIN_KEY_LENGTH = 6;

export const hasAdminKey = () => Boolean(loadFromStorage(KEY_STORAGE, null));

export const setAdminKey = (key) => saveToStorage(KEY_STORAGE, hash(key.trim()));

export const checkAdminKey = (key) => loadFromStorage(KEY_STORAGE, null) === hash(key.trim());

export const isUnlocked = () => {
  try {
    return window.sessionStorage.getItem(SESSION) === '1';
  } catch {
    return false;
  }
};

export const setUnlocked = (value) => {
  try {
    if (value) window.sessionStorage.setItem(SESSION, '1');
    else window.sessionStorage.removeItem(SESSION);
  } catch {
    /* ignore */
  }
};
