import datetime
from typing import Dict, List


class Habit:
    """Used to define what a Habit is, as well as what info from that habit is saved"""

    def __init__(self, name: str):
        self.name = name
        self.logs: List[datetime.date] = []
        self.streak: int = 0

    def mark_complete(self):
        """This function is here to allow the users to mark a habit as complete.
        The program will save the date & update streak."""

        today = datetime.date.today()

        # if this task hasn't been logged today
        if today in self.logs:
            print(f"Habit '{self.name}' has already been marked as complete for today.")
            return

        if self.logs and (today - (self.logs[-1])).days == 1:
            self.streak += 1
            print(f"Habit '{self.name}' marked complete for {today}.")
        else:
            self.streak = 1
            self.logs.append(today)


class HabitTracker:
    """Used to save various habits"""

    def __init__(self):
        self.habits: Dict[str, Habit] = {}

    def add_habit(self, name: str):
        """This will allow the user to add a new habit to their profile"""

        if name not in self.habits:
            self.habits[name] = Habit(name)
            print(f"Habit '{name}' added succesfully.")
        else:
            print(f"Habit '{name}' already exists.")

    def complete_habit(self, name: str):
        """This is used to mark a habit as completed for the day"""

        if name not in self.habits:
            print(f"Habit '{name}' does not exist.")
        else:
            self.habits[name].mark_complete()
            habit_streak = self.habits[name].streak
            print(f"Current habit streak: {habit_streak} day(s).")

    def delete_habit(self, name: str):
        """This method was added to allow the user to delete a habit they
        no longer want to track"""

        if name in self.habits:
            del self.habits[name]
            print(f"Habit '{name}' added succesfully.")
        else:
            print(f"Habit '{name}' doesn't exist.")

    def show_habits(self):
        """This method was added to display all the current habits in the user's profile"""

        print(f"List of current habits -> ")

        if not self.habits:
            return

        for habit in self.habits.values():
            print(f"{habit.name} | Streak: {habit.streak} days")


def main():
    habit_tracker = HabitTracker()

    while True:
        print("\n--- Habit Tracker ---")
        print("1. Add habit")
        print("2. Mark habit complete")
        print("3. Show habits")
        print("4. Delete habit")
        print("5. Quit")

        choice = input("Choose an option: ")

        if choice == "1":
            name = input("Enter habit name: ")
            habit_tracker.add_habit(name)

        elif choice == "2":
            habit_tracker.show_habits()
            name = input("Enter habit to complete: ")
            habit_tracker.complete_habit(name)

        elif choice == "3":
            habit_tracker.show_habits()

        elif choice == "4":
            habit_tracker.show_habits()
            name = input("Enter habit to delete: ")
            habit_tracker.delete_habit(name)

        elif choice == "5":
            print("Quitting app...")
            break

        else:
            print("Invalid choice. Try again.")


if __name__ == "__main__":
    main()
