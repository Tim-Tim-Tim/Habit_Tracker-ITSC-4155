import {
  Activity,
  Briefcase,
  Brain,
  BookOpen,
  Coffee,
} from "lucide-react";

export const CATEGORIES = {
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
    color: "bg-slate-500",
    light: "bg-slate-50 dark:bg-slate-800",
    text: "text-slate-600 dark:text-slate-400",
    icon: Activity,
  },
};
