import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Save } from "lucide-react";
import MoodSelector from "@/components/MoodSelector";
import { saveMoodEntry, getMoodHistory } from "@/lib/moodStorage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function Home() {
  const [emoji, setEmoji] = useState("");
  const [label, setLabel] = useState("");
  const [reason, setReason] = useState("");

  const todayEntry = getMoodHistory().find(
    (e) => e.date === new Date().toISOString().split("T")[0]
  );

  const handleSelect = (e: string, l: string) => {
    setEmoji(e);
    setLabel(l);
  };

  const handleSave = () => {
    if (!emoji) return;
    saveMoodEntry({
      date: new Date().toISOString().split("T")[0],
      mood: label,
      emoji,
      reason,
    });
    toast.success("Mood saved! 🎉");
    setEmoji("");
    setLabel("");
    setReason("");
  };

  return (
    <div className="px-4 pt-8 pb-28 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-accent" />
          <span className="text-sm font-medium text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          How are you feeling?
        </h1>
      </motion.div>

      {todayEntry && !emoji && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-2xl p-5 mb-8"
        >
          <p className="text-sm text-muted-foreground mb-1">Today's mood</p>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{todayEntry.emoji}</span>
            <div>
              <p className="font-semibold">{todayEntry.mood}</p>
              {todayEntry.reason && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {todayEntry.reason}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      <MoodSelector selected={emoji} onSelect={handleSelect} />

      <AnimatePresence>
        {emoji && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-8 space-y-4 overflow-hidden"
          >
            <div className="glass-card rounded-2xl p-5 text-center">
              <span className="text-5xl">{emoji}</span>
              <p className="mt-2 font-semibold text-lg">
                Feeling {label}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                What's on your mind?
              </label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Write about how you're feeling..."
                className="min-h-[100px] rounded-xl bg-card border-border/50 resize-none"
              />
            </div>

            <Button
              onClick={handleSave}
              className="w-full h-12 rounded-xl text-base font-semibold gap-2"
            >
              <Save className="w-4 h-4" />
              Save Entry
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
