import { motion } from "framer-motion";

type Mood = {
  emoji: string;
  label: string;
  color: string;
};

const moods: Mood[] = [
  { emoji: "😊", label: "Great", color: "bg-mood-great" },
  { emoji: "🙂", label: "Good", color: "bg-mood-good" },
  { emoji: "😐", label: "Okay", color: "bg-mood-okay" },
  { emoji: "😞", label: "Bad", color: "bg-mood-bad" },
  { emoji: "😡", label: "Awful", color: "bg-mood-horrible" },
];

interface MoodSelectorProps {
  selected: string;
  onSelect: (emoji: string, label: string) => void;
}

export default function MoodSelector({ selected, onSelect }: MoodSelectorProps) {
  return (
    <div className="flex gap-3 justify-center flex-wrap">
      {moods.map((mood, i) => {
        const isSelected = selected === mood.emoji;
        return (
          <motion.button
            key={mood.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(mood.emoji, mood.label)}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 min-w-[5rem] ${
              isSelected
                ? `${mood.color}/20 border-current shadow-lg scale-105`
                : "bg-card border-border/50 hover:border-border"
            }`}
          >
            <span className="text-3xl">{mood.emoji}</span>
            <span className={`text-xs font-semibold ${isSelected ? "" : "text-muted-foreground"}`}>
              {mood.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

export { moods };
