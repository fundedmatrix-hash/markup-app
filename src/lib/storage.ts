import { openDB, DBSchema } from 'idb';

interface MarkupDB extends DBSchema {
  projects: {
    key: string;
    value: {
      id: string;
      name: string;
      kind: 'screenshot' | 'recording' | 'note' | 'drawing' | 'project';
      createdAt: string;
      data?: Record<string, unknown>;
    };
    indexes: {
      'by-kind': string;
    };
  };
}

export const STORAGE_KEYS = {
  preferences: 'markup.preferences',
  notes: 'markup.notes',
  snippets: 'markup.snippets'
};

export const defaultPreferences = {
  theme: 'system',
  boardMode: false,
  color: '#f97316',
  thickness: 3,
  opacity: 0.9,
  tool: 'pen' as const
};

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage quotas and browser restrictions
  }
}

export const dbPromise = openDB<MarkupDB>('markup-db', 1, {
  upgrade(db) {
    const store = db.createObjectStore('projects', { keyPath: 'id' });
    store.createIndex('by-kind', 'kind');
  }
});

export async function saveProject(item: {
  id: string;
  name: string;
  kind: 'screenshot' | 'recording' | 'note' | 'drawing' | 'project';
  createdAt: string;
  data?: Record<string, unknown>;
}) {
  const db = await dbPromise;
  await db.put('projects', item);
}

export async function listProjects() {
  const db = await dbPromise;
  return db.getAll('projects');
}
