// Safe localStorage helpers (won't throw in private mode / SSR).
export const loadFromStorage = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn(`Saved data "${key}" could not be read, so defaults are used instead.`, err);
    return fallback;
  }
};

/** Returns true when the value was saved, false when the browser refused (e.g. storage full). */
export const saveToStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const removeFromStorage = (key) => {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
};
