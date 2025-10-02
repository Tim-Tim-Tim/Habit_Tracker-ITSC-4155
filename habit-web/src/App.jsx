import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listHabits, createHabit, completeHabit, deleteHabit } from "./api/habits";
import HabitForm from "./components/HabitForm";
import HabitList from "./components/HabitList";
import "./App.css";


function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


function App() {

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

    <div style={{ maxWidth: 1080, margin: "40px auto", padding: "0 16px" }}>

      {/* DEFAULT HEADER, going to have to edit later */}
      <header style={{margin: "40px auto", padding: "5px 16px", backgroundColor: "gray"}}>
        <h1>Habit Tracker</h1>
        <nav>||  HOME  ||  ACCOUNT ||  EXAMPLE  ||  ETC  ||</nav>
      </header>

      <HabitForm
        onCreate={(name) => createHabitAction.mutate(name)}
        isLoading={createHabitAction.isPending}
      />

      {habitsQuery.isLoading ? (
        <p>Loading...</p>
      ) : habitsQuery.isError ? (
        <p>Error loading habits</p>
      ) : (
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

      {/* DEFAULT FOOTER, going to have to edit later */}
      <footer style={{margin: "40px auto", padding: "5px 16px", backgroundColor: "black"}}>
        @Copyright TJ, Nathaniel, Ryan, Mohamed, Sweta, 2025
      </footer>

    </div>
  );

}


export default App
