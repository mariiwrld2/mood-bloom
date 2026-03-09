import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, BookOpen, Smile, BarChart3 } from "lucide-react";
import { getMoodHistory, getJournalEntries } from "@/lib/moodStorage";

export default function Profile() {
  const [moodCount, setMoodCount] = useState(0);
  const [journalCount, setJournalCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [topMood, setTopMood] = useState({ emoji: "—", label: "No data" });

  useEffect(() => {
    const history = getMoodHistory();
    const journals = getJournalEntries();
    setMoodCount(history.length);
    setJournalCount(journals.length);

    // Calculate streak
    const dates = [...new Set(history.map((e) => e.date))].sort().reverse();
    let s = 0;
    const today = new Date();
    for (let i = 0; i < dates.length; i++) {
      const expected = new Date(today);
      expected.setDate(expected.getDate() - i);
      if (dates[i] === expected.toISOString().split("T")[0]) {
        s++;
      } else break;
    }
    setStreak(s);

    // Top mood
    if (history.length > 0) {
      const freq: Record<string, { count: number; emoji: string }> = {};
      history.forEach((e) => {
        if (!freq[e.mood]) freq[e.mood] = { count: 0, emoji: e.emoji };
        freq[e.mood].count++;
      });
      const top = Object.entries(freq).sort((a, b) => b[1].count - a[1].count)[0];
      setTopMood({ emoji: top[1].emoji, label: top[0] });
    }
  }, []);

  const stats = [
    { icon: Smile, label: "Mood Entries", value: moodCount, color: "text-primary" },
    { icon: BookOpen, label: "Journal Entries", value: journalCount, color: "text-accent" },
    { icon: TrendingUp, label: "Day Streak", value: streak, color: "text-mood-great" },
  ];

  return (
    <div className="px-4 pt-8 pb-28 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold tracking-tight mb-8">Profile</h1>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-4xl shadow-lg mb-3">
            🧘
          </div>
          <h2 className="text-xl font-semibold">Mindful User</h2>
          <p className="text-sm text-muted-foreground">Tracking since today</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-4 text-center"
            >
              <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-1">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Most common mood */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Most Common Mood</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{topMood.emoji}</span>
            <span className="text-lg font-semibold">{topMood.label}</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
