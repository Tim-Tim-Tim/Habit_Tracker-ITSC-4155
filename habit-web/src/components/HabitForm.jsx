import { useState } from "react";

function HabitForm({ onCreate, isLoading }) {

    const [name, setName] = useState("");

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            const trimmed = name.trim();
            if (!trimmed) return;
            onCreate(trimmed);
            setName("");
        }}
        style={{ display: "flex", gap: 8, marginBottom: 24 }}
        >
            {/*  */}
            {/* CHANGE THE STYLE LATER TO BE MODULE THING I SAW ON YOUTUBE to stay consistent */}
            {/*  */}

            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="New habit name"
                aria-label="New habit name"
                style={{ flex: 1, padding: 10 }}
            />

            <button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add"}
            </button>

        </form>
    );
}


export default HabitForm
