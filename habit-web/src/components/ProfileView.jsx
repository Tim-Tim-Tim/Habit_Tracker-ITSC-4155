import React from "react";
import { Flame, PieChart, BarChart2, LogOut } from "lucide-react";
import { getLast7Days } from "../utils/dateUtils";
import AggregateBarChart from "./AggregateBarChart";
import DonutChart from "./DonutChart";

export default function ProfileView({ user, habits, onLogout, currentDateStr }) {
  const totalHabits = habits.length;
  const totalCompletions = habits.reduce(
    (acc, h) => acc + (h.logs || []).length,
    0
  );

  const baseDate = currentDateStr
    ? new Date(currentDateStr)
    : new Date();

  const last7 = getLast7Days(baseDate);

  const completionsLast7Days = habits.reduce(
    (acc, h) =>
      acc +
      (h.logs || []).filter((d) => last7.includes(d)).length,
    0
  );

  const possibleCompletions = totalHabits * 7;
  const globalEfficiency =
    possibleCompletions > 0
      ? Math.round(
          (completionsLast7Days / possibleCompletions) * 100
        )
      : 0;

  return (
    <div className="p-6 max-w-6xl mx-auto animate-in slide-in-from-right duration-300 pb-24">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-slate-800 mb-8 transition-colors">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 w-full">
            <div className="flex justify-between items-center mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                    {user.name}
                  </h2>
                </div>
                <p className="text-gray-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                  {user.email}
                </p>
              </div>
              <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg shrink-0">
                {user.name ? user.name[0].toUpperCase() : "U"}
              </div>
            </div>
            <div className="flex justify-center md:justify-start gap-4 mt-6">
              <div className="bg-gray-50 dark:bg-slate-800 px-6 py-3 rounded-2xl border border-gray-100 dark:border-slate-700 text-center">
                <div className="text-gray-400 dark:text-slate-500 text-xs font-bold uppercase">
                  Total Habits
                </div>
                <div className="text-xl font-black text-gray-900 dark:text-white">
                  {totalHabits}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-slate-800 px-6 py-3 rounded-2xl border border-gray-100 dark:border-slate-700 text-center">
                <div className="text-gray-400 dark:text-slate-500 text-xs font-bold uppercase">
                  Completions
                </div>
                <div className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-1">
                  {totalCompletions}{" "}
                  <Flame size={16} className="text-orange-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Analytics &amp; Progress
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col justify-between min-h-[300px] transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
              <BarChart2 size={20} />
            </div>
            <h3 className="font-bold text-gray-800 dark:text-slate-200">
              Weekly Overview
            </h3>
          </div>
          <div className="flex-1 pt-4">
            <AggregateBarChart
              habits={habits}
              color="bg-blue-500"
              currentDateStr={currentDateStr}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col items-center justify-center min-h-[300px] transition-colors">
          <div className="flex items-center gap-2 mb-8 w-full">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400">
              <PieChart size={20} />
            </div>
            <h3 className="font-bold text-gray-800 dark:text-slate-200">
              Weekly Efficiency
            </h3>
          </div>
          <DonutChart
            percent={globalEfficiency}
            color="bg-emerald-500"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onLogout}
          className="bg-red-50 dark:bg-red-900/20 text-red-500 px-8 py-3 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center gap-2"
        >
          <LogOut size={20} /> Log Out
        </button>
      </div>
    </div>
  );
}
