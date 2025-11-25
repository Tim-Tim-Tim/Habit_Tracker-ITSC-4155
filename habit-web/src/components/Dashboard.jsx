import React from "react";
import { Plus, Check, Flame } from "lucide-react";
import { CATEGORIES } from "../constants/categories";

export default function Dashboard({
  user,
  habits,
  onAdd,
  onSelect,
  onToggle,
  completingName,
  deletingName,
  currentDateStr,
}) {
  const today =
    currentDateStr || new Date().toISOString().split("T")[0];

  const completedToday = habits.filter((h) =>
    (h.logs || []).includes(today)
  ).length;

  return (
    <div className="p-6 max-w-6xl mx-auto animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Hello,{" "}
            <span className="text-blue-600 dark:text-blue-400">
              {user.name}
            </span>
            !
          </h2>
          <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium">
            You&apos;ve completed{" "}
            <span className="text-blue-600 dark:text-blue-400 font-bold">
              {completedToday}
            </span>{" "}
            habits today.
          </p>
        </div>
        <button
          onClick={onAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-200 dark:shadow-blue-900/20 flex items-center gap-2 transition-all active:scale-95 hover:-translate-y-1 hover:shadow-xl font-bold"
        >
          <Plus size={20} /> Add Habit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habits.map((habit) => {
          const theme =
            CATEGORIES[habit.category] || CATEGORIES.Health;
          const Icon = theme.icon;
          const isDoneToday = (habit.logs || []).includes(today);

          return (
            <div
              key={habit.name}
              className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-visible"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(habit.name);
                }}
                className={`absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm z-20 ${
                  isDoneToday
                    ? `${theme.color} text-white shadow-md scale-110`
                    : "bg-gray-100 dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 text-gray-400 dark:text-slate-500 hover:bg-gray-200 dark:hover:bg-slate-700 hover:border-gray-400"
                }`}
              >
                <Check
                  size={20}
                  strokeWidth={4}
                  className={
                    isDoneToday
                      ? "opacity-100"
                      : "opacity-20 hover:opacity-100 transition-opacity"
                  }
                />
              </button>

              <div
                onClick={() => onSelect(habit.name)}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`p-4 rounded-2xl ${theme.light} ${theme.text} group-hover:scale-110 transition-transform`}
                  >
                    <Icon size={24} />
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${theme.light} ${theme.text}`}
                  >
                    {habit.category}
                  </div>
                </div>
                <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-1">
                  {habit.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 font-medium mb-6">
                  <Flame
                    size={14}
                    className="text-orange-500"
                  />{" "}
                  {(habit.logs || []).length} total
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-400 dark:text-slate-500">
                    <span>Today</span>
                    <span>
                      {isDoneToday ? "Completed" : "Pending"}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${theme.color} rounded-full transition-all duration-500 ease-out`}
                      style={{
                        width: isDoneToday ? "100%" : "0%",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {habits.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-400 dark:text-slate-500">
            <p>No habits yet. Click &quot;Add Habit&quot; to start!</p>
          </div>
        )}
      </div>
    </div>
  );
}
