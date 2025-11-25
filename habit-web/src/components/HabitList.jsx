import '../index.css';
import HabitCard from "./HabitCard";

function HabitList({
  habits,
  onComplete,
  onDelete,
  completingName,
  deletingName,
}) {
  const items = Array.isArray(habits) ? habits : [];

  if (!items.length) {
    return (
      <div className="col-span-full text-center py-20 text-gray-400 dark:text-slate-500 text-sm">
        <p>No habits yet. Click "Add Habit" to start!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((h) => (
        <HabitCard
          key={h.name}
          habit={h}
          onComplete={() => onComplete(h.name)}
          onDelete={() => onDelete(h.name)}
          completing={completingName === h.name}
          deleting={deletingName === h.name}
        />
      ))}
    </div>
  );
}

export default HabitList;
