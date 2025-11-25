import '../index.css';
import { useState } from "react";

function HabitForm({ onCreate, isLoading }) {

    const [name, setName] = useState("");

    return (
        <form
            className="habit-form"
            onSubmit={(e) => {
                e.preventDefault();
                const trimmed = name.trim();
                if (!trimmed) return;
                onCreate(trimmed);
                setName("");
        }}>
            
            <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name your habit (e.g., Workout)"
                aria-label="New habit name"
            />

            <button className="btn btn-primary" type="submit" disabled={isLoading}>
                {isLoading ? "Adding…" : "Add"}
            </button>

        </form>
    );
}


export default HabitForm
