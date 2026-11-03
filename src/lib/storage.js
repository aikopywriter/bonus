import { useEffect, useState, useCallback, useRef } from 'react';

const PREFIX = 'billdaa:';

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('billdaa-store', { detail: key }));
    return true;
  } catch {
    return false;
  }
}

export function remove(key) {
  try { localStorage.removeItem(PREFIX + key); } catch { /* ignore */ }
}

// React state that is remembered on this device and shared between tools
export function useStored(key, initial) {
  const [value, setValue] = useState(() => {
    const stored = load(key, undefined);
    if (stored === undefined) return initial;
    if (initial && typeof initial === 'object' && !Array.isArray(initial) && stored && typeof stored === 'object') {
      return { ...initial, ...stored };
    }
    return stored;
  });

  useEffect(() => {
    const onChange = (e) => {
      if (e.detail === key) {
        const v = load(key, undefined);
        if (v !== undefined) setValue((prev) => (JSON.stringify(prev) === JSON.stringify(v) ? prev : v));
      }
    };
    window.addEventListener('billdaa-store', onChange);
    return () => window.removeEventListener('billdaa-store', onChange);
  }, [key]);

  const ref = useRef(value);
  ref.current = value;

  const update = useCallback(
    (next) => {
      const v = typeof next === 'function' ? next(ref.current) : next;
      ref.current = v;
      setValue(v);
      save(key, v);
    },
    [key]
  );

  return [value, update];
}
