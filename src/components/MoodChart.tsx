import { useMemo } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";
import type { MoodEntry } from "@/lib/moodStorage";

const moodToScore: Record<string, number> = {
  Great: 5,
  Good: 4,
  Okay: 3,
  Bad: 2,
  Awful: 1,
};

const scoreToEmoji: Record<number, string> = {
  5: "😊",
  4: "🙂",
  3: "😐",
  2: "😞",
  1: "😡",
};

interface MoodChartProps {
  history: MoodEntry[];
}

export default function MoodChart({ history }: MoodChartProps) {
  const chartData = useMemo(() => {
    const last7 = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayEntries = history.filter((e) => e.date === dateStr);
      const avg =
        dayEntries.length > 0
          ? dayEntries.reduce((sum, e) => sum + (moodToScore[e.mood] || 3), 0) / dayEntries.length
          : null;
      last7.push({
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
        date: dateStr,
        score: avg,
      });
    }
    return last7;
  }, [history]);

  const hasData = chartData.some((d) => d.score !== null);

  if (!hasData) return null;

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]?.value) return null;
    const score = Math.round(payload[0].value);
    return (
      <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-lg text-sm">
        <span className="text-lg mr-1">{scoreToEmoji[score] || "😐"}</span>
        <span className="font-medium">{payload[0].payload.date}</span>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-5 mb-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold">Weekly Mood Trend</span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(243, 75%, 55%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(243, 75%, 55%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 15%, 90%)" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: "hsl(240, 5%, 46%)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fontSize: 11, fill: "hsl(240, 5%, 46%)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => scoreToEmoji[v] || ""}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="score"
            stroke="hsl(243, 75%, 55%)"
            strokeWidth={2.5}
            fill="url(#moodGrad)"
            connectNulls
            dot={{ r: 4, fill: "hsl(243, 75%, 55%)", strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "hsl(243, 75%, 55%)", strokeWidth: 2, stroke: "#fff" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
