import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { CATEGORIES } from "../constants/categories";

export default function HabitModal({ isOpen, onClose, onSave }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Health");

  useEffect(() => {
    if (isOpen) {
      setName("");
      setCategory("Health");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            New Habit
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-400 dark:text-slate-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">
              Category (visual only)
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(CATEGORIES).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                    category === cat
                      ? `${CATEGORIES[cat].color} text-white shadow-md`
                      : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">
              Habit Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              placeholder="e.g. Drink Water"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              if (name) {
                onSave(name, category);
                onClose();
              }
            }}
            className="w-full mt-4 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-200 text-white dark:text-slate-900 font-bold py-4 rounded-xl shadow-lg shadow-gray-200 dark:shadow-none transition-all active:scale-95 hover:-translate-y-1 hover:shadow-xl"
          >
            Create Habit
          </button>
        </div>
      </div>
    </div>
  );
}
