import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X, Calendar } from "lucide-react";
import MoodChart from "@/components/MoodChart";
import { getMoodHistory, deleteMoodEntry, type MoodEntry } from "@/lib/moodStorage";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function History() {
  const [history, setHistory] = useState<MoodEntry[]>([]);
  const [selected, setSelected] = useState<MoodEntry | null>(null);

  useEffect(() => {
    setHistory(getMoodHistory());
  }, []);

  const handleDelete = (id: string) => {
    deleteMoodEntry(id);
    setHistory((h) => h.filter((e) => e.id !== id));
    setSelected(null);
    toast.success("Entry deleted");
  };

  return (
    <div className="px-4 pt-8 pb-28 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Mood History</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {history.length} {history.length === 1 ? "entry" : "entries"} recorded
        </p>
      </motion.div>

      {history.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No entries yet</p>
          <p className="text-sm">Start tracking your mood on the Home tab</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((entry, i) => (
            <motion.button
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelected(entry)}
              className="w-full glass-card rounded-2xl p-4 flex items-center gap-4 text-left hover:shadow-xl transition-shadow"
            >
              <span className="text-3xl">{entry.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{entry.mood}</p>
                <p className="text-xs text-muted-foreground">{entry.date}</p>
              </div>
              {entry.reason && (
                <p className="text-xs text-muted-foreground truncate max-w-[120px] hidden sm:block">
                  {entry.reason}
                </p>
              )}
            </motion.button>
          ))}
        </div>
      )}

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-5xl">{selected.emoji}</span>
                  <h2 className="text-xl font-bold mt-2 font-display">{selected.mood}</h2>
                  <p className="text-sm text-muted-foreground">{selected.date}</p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selected.reason && (
                <div className="bg-muted/50 rounded-xl p-4 mb-4">
                  <p className="text-sm leading-relaxed">{selected.reason}</p>
                </div>
              )}

              <Button
                variant="destructive"
                onClick={() => handleDelete(selected.id)}
                className="w-full gap-2 rounded-xl"
              >
                <Trash2 className="w-4 h-4" />
                Delete Entry
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
