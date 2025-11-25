import '../index.css';

import {
  Activity,
  Briefcase,
  Brain,
  BookOpen,
  Coffee,
  Flame,
  Check,
} from "lucide-react";

const CATEGORIES = {
  Health: {
    color: "bg-emerald-500",
    light: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-600 dark:text-emerald-400",
    icon: Activity,
  },
  Work: {
    color: "bg-blue-500",
    light: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
    icon: Briefcase,
  },
  Mindfulness: {
    color: "bg-violet-500",
    light: "bg-violet-50 dark:bg-violet-900/20",
    text: "text-violet-600 dark:text-violet-400",
    icon: Brain,
  },
  Education: {
    color: "bg-amber-500",
    light: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-600 dark:text-amber-400",
    icon: BookOpen,
  },
  Lifestyle: {
    color: "bg-pink-500",
    light: "bg-pink-50 dark:bg-pink-900/20",
    text: "text-pink-600 dark:text-pink-400",
    icon: Coffee,
  },
  General: {
    color: "bg-emerald-500",
    light: "bg-emerald-50 dark:bg-slate-800",
    text: "text-emerald-600 dark:text-emerald-400",
    icon: Activity,
  },
};

function HabitCard({
  habit,
  onComplete,
  onDelete,
  completing,
  deleting,
}) {
  const logs = Array.isArray(habit?.logs) ? habit.logs : [];
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const isDoneToday = logs.includes(today);
  const totalCompletions = logs.length;
  const disabled = completing || deleting;

  // backend doesn’t have category yet → default to General
  const category = habit.category || "General";
  const theme = CATEGORIES[category] || CATEGORIES.General;
  const Icon = theme.icon;

  return (
    <article className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-visible">
      {/* big check button top-right */}
      <button
        type="button"
        onClick={onComplete}
        disabled={disabled}
        className={`absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm z-10
          ${
            isDoneToday
              ? `${theme.color} text-white shadow-md scale-110`
              : "bg-gray-100 dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 text-gray-400 dark:text-slate-500 hover:bg-gray-200 dark:hover:bg-slate-700 hover:border-gray-400"
          }
          ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <Check
          size={20}
          strokeWidth={4}
          className={
            isDoneToday
              ? "opacity-100"
              : "opacity-20 group-hover:opacity-80"
          }
        />
      </button>

      <div className="flex items-center gap-4 mb-6">
        <div
          className={`p-4 rounded-2xl ${theme.light} ${theme.text} group-hover:scale-110 transition-transform`}
        >
          <Icon size={24} />
        </div>
        <div
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${theme.light} ${theme.text}`}
        >
          {category}
        </div>
      </div>

      <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-1">
        {habit.name}
      </h3>

      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 font-medium mb-6">
        <Flame size={14} className="text-orange-500" />
        <span>{totalCompletions} total</span>
        <span className="mx-1">•</span>
        <span>
          Streak: {habit.streak} day{habit.streak === 1 ? "" : "s"}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold text-gray-400 dark:text-slate-500">
          <span>Today</span>
          <span>{isDoneToday ? "Completed" : "Pending"}</span>
        </div>
        <div className="h-2 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${theme.color} rounded-full transition-all duration-500 ease-out`}
            style={{ width: isDoneToday ? "100%" : "0%" }}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onDelete}
          disabled={disabled}
          className="text-xs font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-60"
        >
          {deleting ? "Deleting…" : "Delete"}
        </button>
      </div>
    </article>
  );
}

export default HabitCard;
