import { useSyncExternalStore } from "react";

export type HistoryKind = "email" | "meeting" | "task" | "research" | "chat";

export interface HistoryItem {
  id: string;
  kind: HistoryKind;
  title: string;
  content: string;
  createdAt: number;
  saved?: boolean;
  meta?: Record<string, unknown>;
}

export interface Stats {
  tasks: number;
  emails: number;
  meetings: number;
  research: number;
  chats: number;
  minutesSaved: number;
  weekly: number[]; // 7 numbers
}

export interface Settings {
  name: string;
  email: string;
  role: string;
  theme: "light" | "dark";
  notifEmail: boolean;
  notifPush: boolean;
  privacyShare: boolean;
  responsibleAcknowledged: boolean;
}

export interface CustomPrompt {
  id: string;
  title: string;
  category: string;
  role: string;
  context: string;
  task: string;
  input: string;
  constraints: string;
  output: string;
  createdAt: number;
}

const KEY_HISTORY = "workmate.history";
const KEY_STATS = "workmate.stats";
const KEY_SETTINGS = "workmate.settings";
const KEY_PROMPTS = "workmate.prompts";

const isBrowser = typeof window !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  if (cache.has(key)) return cache.get(key) as T;
  try {
    const raw = localStorage.getItem(key);
    const val = raw ? (JSON.parse(raw) as T) : fallback;
    cache.set(key, val);
    return val;
  } catch {
    return fallback;
  }
}

function write(key: string, val: unknown) {
  if (!isBrowser) return;
  cache.set(key, val);
  localStorage.setItem(key, JSON.stringify(val));
}

// Cached snapshots keep object identity stable between reads, which
// useSyncExternalStore requires to avoid infinite re-render loops.
const cache = new Map<string, unknown>();

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

// -------- Sample seed data --------
const seedHistory: HistoryItem[] = [
  {
    id: "seed-1",
    kind: "email",
    title: "Follow-up on Q3 budget proposal",
    content:
      "Subject: Follow-up on Q3 Budget Proposal\n\nDear Sarah,\n\nI hope this message finds you well. I wanted to follow up on the Q3 budget proposal we discussed last week...",
    createdAt: Date.now() - 1000 * 60 * 60 * 3,
    saved: true,
  },
  {
    id: "seed-2",
    kind: "meeting",
    title: "Product Roadmap Sync — Nov 12",
    content:
      "Executive Summary: The team aligned on Q4 priorities focusing on onboarding, retention, and enterprise readiness...",
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    saved: true,
  },
  {
    id: "seed-3",
    kind: "task",
    title: "Weekly plan — Design sprint",
    content: "Structured 5-day plan for design sprint with prioritized deliverables and breaks.",
    createdAt: Date.now() - 1000 * 60 * 60 * 26,
  },
  {
    id: "seed-4",
    kind: "research",
    title: "AI in workplace productivity — overview",
    content: "Topic Overview: AI-powered productivity tools have grown 45% YoY...",
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    saved: true,
  },
  {
    id: "seed-5",
    kind: "chat",
    title: "Chat — Preparing for stakeholder meeting",
    content: "Discussion on how to structure a stakeholder meeting agenda.",
    createdAt: Date.now() - 1000 * 60 * 60 * 72,
  },
];

const seedStats: Stats = {
  tasks: 47,
  emails: 32,
  meetings: 18,
  research: 12,
  chats: 26,
  minutesSaved: 940,
  weekly: [3, 5, 4, 8, 6, 9, 7],
};

const seedSettings: Settings = {
  name: "Alex Morgan",
  email: "alex.morgan@company.com",
  role: "Product Manager",
  theme: "light",
  notifEmail: true,
  notifPush: false,
  privacyShare: false,
  responsibleAcknowledged: false,
};

// -------- Public API --------
export const store = {
  getHistory(): HistoryItem[] {
    return read<HistoryItem[]>(KEY_HISTORY, seedHistory);
  },
  setHistory(items: HistoryItem[]) {
    write(KEY_HISTORY, items);
    emit();
  },
  addHistory(item: Omit<HistoryItem, "id" | "createdAt"> & { id?: string }) {
    const items = store.getHistory();
    const newItem: HistoryItem = {
      id: item.id ?? crypto.randomUUID(),
      createdAt: Date.now(),
      ...item,
    };
    store.setHistory([newItem, ...items]);
    return newItem;
  },
  updateHistory(id: string, patch: Partial<HistoryItem>) {
    store.setHistory(store.getHistory().map((h) => (h.id === id ? { ...h, ...patch } : h)));
  },
  deleteHistory(id: string) {
    store.setHistory(store.getHistory().filter((h) => h.id !== id));
  },
  clearHistory() {
    store.setHistory([]);
  },

  getStats(): Stats {
    return read<Stats>(KEY_STATS, seedStats);
  },
  bumpStat(kind: HistoryKind, minutes = 15) {
    const s = store.getStats();
    const map: Record<HistoryKind, keyof Stats> = {
      email: "emails",
      meeting: "meetings",
      task: "tasks",
      research: "research",
      chat: "chats",
    };
    const field = map[kind];
    const weekly = [...s.weekly];
    weekly[weekly.length - 1] = (weekly[weekly.length - 1] ?? 0) + 1;
    const next: Stats = {
      ...s,
      [field]: (s[field] as number) + 1,
      minutesSaved: s.minutesSaved + minutes,
      weekly,
    };
    write(KEY_STATS, next);
    emit();
  },

  getSettings(): Settings {
    return read<Settings>(KEY_SETTINGS, seedSettings);
  },
  setSettings(patch: Partial<Settings>) {
    const s = { ...store.getSettings(), ...patch };
    write(KEY_SETTINGS, s);
    if (isBrowser) {
      document.documentElement.classList.toggle("dark", s.theme === "dark");
    }
    emit();
  },

  getPrompts(): CustomPrompt[] {
    return read<CustomPrompt[]>(KEY_PROMPTS, []);
  },
  savePrompt(p: Omit<CustomPrompt, "id" | "createdAt"> & { id?: string }) {
    const list = store.getPrompts();
    const item: CustomPrompt = {
      id: p.id ?? crypto.randomUUID(),
      createdAt: Date.now(),
      ...p,
    };
    write(KEY_PROMPTS, [item, ...list.filter((x) => x.id !== item.id)]);
    emit();
    return item;
  },
  deletePrompt(id: string) {
    write(
      KEY_PROMPTS,
      store.getPrompts().filter((p) => p.id !== id),
    );
    emit();
  },
};

export function useStore<T>(selector: () => T): T {
  return useSyncExternalStore(
    subscribe,
    selector,
    selector,
  );
}

export function initTheme() {
  if (!isBrowser) return;
  const s = store.getSettings();
  document.documentElement.classList.toggle("dark", s.theme === "dark");
}