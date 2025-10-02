import HabitCard from "./HabitCard";

function HabitList({habits, onComplete, onDelete, completingName, deletingName,}) {

    if (!habits.length) return <p>No habits yet. Add one above.</p>;

    //again, remember to change the style stuff early, I have to find that brocode video

    return (
        <div style={{ display: "grid", gap: 12 }}>
            {habits.map((h) => (
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
export default HabitList