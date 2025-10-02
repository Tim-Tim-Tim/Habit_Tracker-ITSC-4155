

function HabitCard({habit, onComplete, onDelete, completing, deleting,}) {
    const lastLog = habit.logs.at(-1) || "Never";
    const disableBoth = completing || deleting;

    // Temporary inline styling, will change later
    return (

        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>

            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>

                <div>
                    <strong>{habit.name}</strong>
                    <div>Streak: {habit.streak} day(s)</div>
                    <div>Last completed: {lastLog}</div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={onComplete} disabled={disableBoth}>
                        {completing ? "Saving..." : "Complete today"}
                    </button>
                    <button onClick={onDelete} disabled={disableBoth}>
                        {deleting ? "Deleting..." : "Delete"}
                    </button>
                </div>

            </div>

        </div>

    );
}

export default HabitCard