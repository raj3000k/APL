export const STORAGE_KEYS = {
  snapshot: "fanpulse.snapshot",
  auth: "fanpulse.auth",
};

export function readStorage<T>(key: string, fallback: T): T {
  const value = localStorage.getItem(key);

  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}
