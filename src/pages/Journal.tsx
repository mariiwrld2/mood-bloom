import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Check, Trash2, PenLine } from "lucide-react";
import {
  getJournalEntries,
  saveJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  type JournalEntry,
} from "@/lib/moodStorage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    setEntries(getJournalEntries());
  }, []);

  const handleCreate = () => {
    if (!newEntry.trim()) return;
    const entry = saveJournalEntry({
      date: new Date().toISOString().split("T")[0],
      entry: newEntry.trim(),
    });
    setEntries((prev) => [entry, ...prev]);
    setNewEntry("");
    setShowNew(false);
    toast.success("Journal entry saved ✍️");
  };

  const handleSaveEdit = () => {
    if (!editingId || !editText.trim()) return;
    updateJournalEntry(editingId, editText.trim());
    setEntries((prev) =>
      prev.map((e) => (e.id === editingId ? { ...e, entry: editText.trim() } : e))
    );
    setEditingId(null);
    setEditText("");
  };

  const handleDelete = (id: string) => {
    deleteJournalEntry(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
    toast.success("Entry deleted");
  };

  return (
    <div className="px-4 pt-8 pb-28 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Journal</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Your thoughts & reflections
          </p>
        </div>
        <Button
          onClick={() => setShowNew(!showNew)}
          size="icon"
          className="rounded-full h-10 w-10"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {showNew && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-4 mb-6 space-y-3"
        >
          <Textarea
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="What's on your mind today?"
            className="min-h-[100px] rounded-xl bg-background border-border/50 resize-none"
            autoFocus
          />
          <div className="flex gap-2">
            <Button onClick={handleCreate} className="flex-1 gap-2 rounded-xl">
              <Check className="w-4 h-4" />
              Save
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowNew(false);
                setNewEntry("");
              }}
              className="rounded-xl"
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      {entries.length === 0 && !showNew ? (
        <div className="text-center py-16 text-muted-foreground">
          <PenLine className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No journal entries</p>
          <p className="text-sm">Tap + to write your first entry</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {entry.date}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditingId(entry.id);
                      setEditText(entry.entry);
                    }}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <PenLine className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {editingId === entry.id ? (
                <div className="space-y-2">
                  <Textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="min-h-[80px] rounded-xl bg-background resize-none"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveEdit} className="rounded-lg gap-1">
                      <Check className="w-3 h-3" /> Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingId(null)}
                      className="rounded-lg"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-relaxed">{entry.entry}</p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
