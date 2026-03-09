export type MoodEntry = {
  id: string;
  date: string;
  mood: string;
  emoji: string;
  reason: string;
  timestamp: number;
};

export type JournalEntry = {
  id: string;
  date: string;
  entry: string;
  timestamp: number;
};

const MOOD_KEY = "moodHistory";
const JOURNAL_KEY = "journalEntries";

export function getMoodHistory(): MoodEntry[] {
  const saved = localStorage.getItem(MOOD_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function saveMoodEntry(entry: Omit<MoodEntry, "id" | "timestamp">): MoodEntry {
  const history = getMoodHistory();
  const newEntry: MoodEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  history.unshift(newEntry);
  localStorage.setItem(MOOD_KEY, JSON.stringify(history));
  return newEntry;
}

export function deleteMoodEntry(id: string) {
  const history = getMoodHistory().filter((e) => e.id !== id);
  localStorage.setItem(MOOD_KEY, JSON.stringify(history));
}

export function getJournalEntries(): JournalEntry[] {
  const saved = localStorage.getItem(JOURNAL_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function saveJournalEntry(entry: Omit<JournalEntry, "id" | "timestamp">): JournalEntry {
  const entries = getJournalEntries();
  const newEntry: JournalEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  entries.unshift(newEntry);
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
  return newEntry;
}

export function updateJournalEntry(id: string, text: string) {
  const entries = getJournalEntries().map((e) =>
    e.id === id ? { ...e, entry: text } : e
  );
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
}

export function deleteJournalEntry(id: string) {
  const entries = getJournalEntries().filter((e) => e.id !== id);
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
}
