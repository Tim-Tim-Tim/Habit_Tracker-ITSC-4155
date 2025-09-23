# New UI part!
import tkinter as tk
from tkinter import messagebox

from Habits_Core import Habit, HabitTracker, datetime


class HabitUI:
    """A tiny interface: list of habits, an input, and three buttons."""

    def __init__(self, root: tk.Tk):
        self.root = root
        self.root.title("Habit Tracker")
        self.root.geometry("560x480")  # Window Size!

        self.tracker = HabitTracker()

        # Title
        tk.Label(root, text="Habit Tracker", font=("Arial", 16, "bold")).pack(
            pady=(2, 4)
        )

        # Input row: "New habit" + entry + Add button
        row = tk.Frame(root)
        row.pack(fill="x", padx=10, pady=5)
        tk.Label(row, text="New habit:").pack(side="left")
        self.entry = tk.Entry(row)
        self.entry.pack(side="left", fill="x", expand=True, padx=6)
        tk.Button(row, text="Add", command=self.on_add).pack(side="left")

        # Habit list with scrollbar
        list_wrap = tk.Frame(root)
        list_wrap.pack(fill="both", expand=True, padx=10, pady=5)

        self.listbox = tk.Listbox(list_wrap, height=20)
        self.listbox.pack(side="left", fill="both", expand=True)

        scrollbar = tk.Scrollbar(list_wrap, command=self.listbox.yview)
        scrollbar.pack(side="right", fill="y")
        self.listbox.config(yscrollcommand=scrollbar.set)

        # Buttons
        btns = tk.Frame(root)
        btns.pack(pady=8)
        tk.Button(btns, text="Mark Complete", command=self.on_complete).pack(
            side="left", padx=4
        )
        tk.Button(btns, text="Delete", command=self.on_delete).pack(side="left", padx=4)
        tk.Button(btns, text="Show in Console", command=self.on_show_console).pack(
            side="left", padx=4
        )

        # Status line
        self.status = tk.Label(root, text="", fg="gray")
        self.status.pack(fill="x", padx=10, pady=(4, 10))

        self.refresh()

    # Helpers
    def _selected_name(self):
        """Return the habit name from the selected row, or None."""
        sel = self.listbox.curselection()
        if not sel:
            return None
        # Row format: "Name | Streak: X | Last: .."
        row_text = self.listbox.get(sel[0])
        return row_text.split(" | ", 1)[0]

    def _last_done_text(self, habit: "Habit"):
        if not habit.logs:
            return "Never"
        last = habit.logs[-1]
        days = (datetime.date.today() - last).days
        if days == 0:
            return "Today"
        if days == 1:
            return "Yesterday"
        return last.isoformat()

    def refresh(self):
        """Rebuild the list from the tracker."""
        self.listbox.delete(0, tk.END)
        for name in sorted(self.tracker.habits.keys(), key=str.lower):
            h = self.tracker.habits[name]
            line = f"{h.name} | Streak: {h.streak} | Last: {self._last_done_text(h)}"
            self.listbox.insert(tk.END, line)
        self.status.config(text=f"{len(self.tracker.habits)} habit(s)")

    # Button actions

    def on_add(self):
        name = self.entry.get().strip()
        if not name:
            messagebox.showinfo("Info", "Enter a habit name.")
            return
        self.tracker.add_habit(name)
        self.entry.delete(0, tk.END)
        self.refresh()

    def on_complete(self):
        name = self._selected_name()
        if not name:
            messagebox.showinfo("Info", "Select a habit to complete.")
            return
        self.tracker.complete_habit(name)
        self.refresh()

    def on_delete(self):
        name = self._selected_name()
        if not name:
            messagebox.showinfo("Info", "Select a habit to delete.")
            return
        if messagebox.askyesno("Confirm", f"Delete habit '{name}'?"):
            self.tracker.delete_habit(name)
            self.refresh()

    def on_show_console(self):
        self.tracker.show_habits()


# Main
if __name__ == "__main__":
    root = tk.Tk()
    HabitUI(root)
    root.mainloop()
