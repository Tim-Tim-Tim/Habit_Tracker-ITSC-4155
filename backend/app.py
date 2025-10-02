from domain import HabitTracker
from fastapi import FastAPI, HTTPException

app = FastAPI(title="Habit API")

tracker = HabitTracker()


# ALL THE FASTAPI STUFF YAY


@app.get("/")
def root():
    return {"message": "Habit API up. See /docs"}


def serialize(h):
    return {"name": h.name, "streak": h.streak, "logs": [d.isoformat() for d in h.logs]}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/habits")
def list_habits():
    return [serialize(h) for h in tracker.show_habits()]


@app.post("/habits")
def create_habit(payload: dict):
    name = (payload.get("name") or "").strip()
    if not name:
        raise HTTPException(422, detail="Name required")
    if not tracker.add_habit(name):
        raise HTTPException(409, detail="Habit already exists")
    return serialize(tracker.habits[name])


@app.post("/habits/{name}/complete")
def complete_habit(name: str):
    h = tracker.complete_habit(name)
    if h is None:
        raise HTTPException(404, detail="Habit not found")
    return serialize(h)


@app.delete("/habits/{name}")
def delete_habit(name: str):
    if not tracker.delete_habit(name):
        raise HTTPException(404, detail="Habit not found")
    return {"ok": True}
