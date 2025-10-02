import datetime
from typing import Dict, List


class Habit:
    def __init__(self, name: str):
        self.name = name
        self.logs: List[datetime.date] = []
        self.streak: int = 0

    def mark_complete(self):
        today = datetime.date.today()
        if today in self.logs:
            return
        if self.logs and (today - (self.logs[-1])).days == 1:
            self.streak += 1
        else:
            self.streak = 1
        self.logs.append(today)


class HabitTracker:
    def __init__(self):
        self.habits: Dict[str, Habit] = {}

    def add_habit(self, name: str):
        if name not in self.habits:
            self.habits[name] = Habit(name)
            return True
        return False

    def complete_habit(self, name: str):
        if name not in self.habits:
            return None
        self.habits[name].mark_complete()
        return self.habits[name]

    def delete_habit(self, name: str):
        if name in self.habits:
            del self.habits[name]
            return True
        return False

    def show_habits(self):
        return list(self.habits.values())
