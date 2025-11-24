import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { listHabits, createHabit, completeHabit, deleteHabit } from "./api/habits";
import HabitForm from "./components/HabitForm";
import HabitList from "./components/HabitList";
import "./App.css";


function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


function App() {
  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Time for silly react queries :,)
  const qc = useQueryClient();

  const [completingName, setCompletingName] = useState(null);
  const [deletingName, setDeletingName] = useState(null);

  // READ habits
  const habitsQuery = useQuery({ queryKey: ["habits"], queryFn: listHabits });

  // ACTION: create a new habit
  const createHabitAction = useMutation({
    mutationFn: (name) => createHabit(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["habits"] }),
  });

  // ACTION: complete a habit
  const completeHabitAction = useMutation({
    mutationFn: async (name) => {
      const res = await completeHabit(name);
      await sleep(1000);
      return res;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["habits"] }),
    onSettled: () => setCompletingName(null),
  });

  // ACTION: delete a habit
  const deleteHabitAction = useMutation({
    mutationFn: async (name) => {
      const res = await deleteHabit(name);
      await sleep(1000);
      return res;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["habits"] }),
    onSettled: () => setDeletingName(null),
  });

  return (

    <div className="app-shell">

      <header className="site-header">
        <div className="container header-inner">
          <h1 className="brand">Habit Tracker</h1>
          <nav className="site-nav">
            <a href="#" className="nav-link is-active">Home</a>
            <a href="#" className="nav-link">Account</a>
            <a href="#" className="nav-link">Examples</a>
            <a href="#" className="nav-link">About</a>
          </nav>
        </div>
      </header>

      <main className="container content">
        <section className="panel">
          <h2 className="panel-title">Create a habit</h2>
            <HabitForm
              onCreate={(name) => createHabitAction.mutate(name)}
              isLoading={createHabitAction.isPending}
            />
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Your habits</h2>
            {habitsQuery.isLoading && <span className="badge">Loading…</span>}
            {habitsQuery.isError && <span className="badge badge-error">Error</span>}
          </div>

          {!habitsQuery.isLoading && !habitsQuery.isError && (
            <HabitList
              habits={habitsQuery.data || []}
              onComplete={(name) => {
                setCompletingName(name);
                completeHabitAction.mutate(name);
              }}
              onDelete={(name) => {
                setDeletingName(name);
                deleteHabitAction.mutate(name);
              }}
              completingName={completingName}
              deletingName={deletingName}
            />
          )}
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p>© 2025 TJ, Nathaniel, Ryan, Mohamed, Sweta</p>
        </div>
      </footer>
      
    </div>
    
  );
}


export default App;
