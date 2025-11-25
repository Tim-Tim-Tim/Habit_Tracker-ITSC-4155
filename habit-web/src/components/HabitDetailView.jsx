import React from "react";
import {
    Calendar,
    Check,
    ChevronRight,
    Trash2,
    Flame,
} from "lucide-react";
import { CATEGORIES } from "../constants/categories";
import { getLast7Days } from "../utils/dateUtils";

export default function HabitDetailView({
    habit,
    onBack,
    onToggleToday,
    onDelete,
    currentDateStr,       // <- simulated "today" (YYYY-MM-DD)
}) {
if (!habit) return null;

const theme = CATEGORIES[habit.category] || CATEGORIES.General;
const Icon = theme.icon;

// Use simulated date if provided, otherwise real today
const baseDate = currentDateStr ? new Date(currentDateStr) : new Date();
const last7 = getLast7Days(baseDate);

const logs = habit.logs || [];
const completedLast7 = last7.map((date) => logs.includes(date));
const completedCount = completedLast7.filter(Boolean).length;
const progressPercent = Math.round((completedCount / 7) * 100);

// "Today" for the UI / toggle logic
const today = currentDateStr || new Date().toISOString().split("T")[0];

return (
    <div className="p-6 max-w-5xl mx-auto animate-in slide-in-from-right duration-300 pb-24">
    <div className="flex items-center justify-between mb-6">
        <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white font-bold bg-white dark:bg-slate-900 px-4 py-2 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
        >
        <ChevronRight className="rotate-180" size={20} /> Back
        </button>
        <button
        onClick={() => onDelete(habit.name)}
        className="bg-red-50 dark:bg-red-900/20 text-red-500 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
        >
        <Trash2 size={20} /> Delete Habit
        </button>
    </div>

    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-slate-800 p-8 md:p-10 overflow-hidden relative transition-colors">
        <div
        className={`absolute -top-24 -right-24 w-64 h-64 rounded-full ${theme.light} opacity-50 blur-3xl`}
        ></div>
        <div className="relative z-10">
        <div className="flex items-center gap-5 mb-8">
            <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center ${theme.light} ${theme.text} shadow-inner`}
            >
            <Icon size={32} />
            </div>
            <div>
            <div
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 ${theme.light} ${theme.text}`}
            >
                {habit.category}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
                {habit.name}
            </h1>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-gray-50 dark:bg-slate-800 rounded-3xl p-6 flex flex-col justify-center items-center border border-gray-100 dark:border-slate-700 transition-colors">
            <div className="text-gray-400 dark:text-slate-500 text-xs font-bold uppercase">
                Total Completions
            </div>
            <div className="text-3xl font-black text-gray-800 dark:text-white mt-1 flex items-center gap-2">
                {logs.length}{" "}
                <Flame className="text-orange-500" />
            </div>
            </div>
            <div className="bg-gray-50 dark:bg-slate-800 rounded-3xl p-6 flex flex-col justify-center items-center border border-gray-100 dark:border-slate-700 transition-colors">
            <div className="text-gray-400 dark:text-slate-500 text-xs font-bold uppercase">
                7-Day Efficiency
            </div>
            <div className="text-3xl font-black text-gray-800 dark:text-white mt-1">
                {progressPercent}%
            </div>
            </div>
            <div className="bg-gray-50 dark:bg-slate-800 rounded-3xl p-6 flex flex-col justify-center items-center border border-gray-100 dark:border-slate-700 transition-colors">
            <div className="text-gray-400 dark:text-slate-500 text-xs font-bold uppercase">
                Last 7 Days
            </div>
            <div className="text-3xl font-black text-gray-800 dark:text-white mt-1">
                {completedCount}/7
            </div>
            </div>
        </div>

        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar size={18} className={theme.text} /> Recent
            History
        </h3>

        <div className="grid grid-cols-7 gap-2 md:gap-4">
            {last7.map((date) => {
            const isDone = logs.includes(date);
            const dayName = new Date(date).toLocaleDateString(
                "en-US",
                { weekday: "short" }
            );
            const isToday = date === today;

            return (
                <button
                key={date}
                onClick={() => isToday && onToggleToday(habit.name)}
                disabled={!isToday}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-300 group ${
                    isDone
                    ? `${theme.color} text-white shadow-lg scale-105`
                    : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                } ${
                    !isToday ? "cursor-default opacity-70" : ""
                }`}
                >
                <span className="text-xs font-bold mb-1">
                    {dayName}
                </span>
                {isDone ? (
                    <Check size={20} strokeWidth={4} />
                ) : (
                    <div className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-gray-400"></div>
                )}
                </button>
            );
            })}
        </div>
        </div>
    </div>
    </div>
);
}
