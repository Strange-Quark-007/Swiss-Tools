export const createMockStorage = (): Storage => {
  const map = new Map<string, string>();

  return {
    key: (index: number) => Array.from(map.keys())[index] ?? null,
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => {
      map.set(key, String(value));
    },
    removeItem: (key: string) => {
      map.delete(key);
    },
    clear: () => {
      map.clear();
    },
    get length() {
      return map.size;
    },
  };
};

export const getStoredState = <T = unknown>(key: string): T | null => {
  const raw = localStorage.getItem(key);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as { state?: T };
    return parsed.state ?? null;
  } catch {
    return null;
  }
};
