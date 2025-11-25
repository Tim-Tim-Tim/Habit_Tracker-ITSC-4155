import React from "react";
import { getLast7Days } from "../utils/dateUtils";

export default function AggregateBarChart({ habits, color }) {
  const last7 = getLast7Days();
  const data = last7.map((date) =>
    habits.reduce(
      (acc, h) =>
        acc + ((h.logs || []).includes(date) ? 1 : 0),
      0
    )
  );
  const maxPossible = habits.length || 1;

  return (
    <div className="flex items-end justify-between h-full w-full gap-2 px-2">
      {data.map((count, i) => {
        const percentage = (count / maxPossible) * 100;
        const dayLabel = new Date(last7[i]).toLocaleDateString(
          "en-US",
          { weekday: "short" }
        );
        return (
          <div
            key={i}
            className="flex flex-col items-center justify-end h-full flex-1 group"
          >
            <div className="relative w-full h-full flex items-end justify-center">
              <div
                className={`w-full max-w-[24px] rounded-t-md transition-all duration-500 ${
                  percentage > 0
                    ? color
                    : "bg-gray-100 dark:bg-slate-800"
                }`}
                style={{ height: `${Math.max(percentage, 5)}%` }}
              ></div>
            </div>
            <div className="text-[10px] font-bold text-gray-400 dark:text-slate-500 mt-2 uppercase">
              {dayLabel}
            </div>
          </div>
        );
      })}
    </div>
  );
}
