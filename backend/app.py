from domain import HabitTracker
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import datetime
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from database import engine, Base, get_db
import models

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Habit API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change later for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

tracker = HabitTracker()


# Pydantic schemas for request/response
class HabitCreate(BaseModel):
    name: str


class HabitLogResponse(BaseModel):
    completion_date: str

    class Config:
        from_attributes = True


class HabitResponse(BaseModel):
    name: str
    streak: int
    logs: List[str]  # List of date strings

    class Config:
        from_attributes = True


@app.get("/")
def root():
    """
    Root endpoint.
    
    Returns:
        dict: A simple message indicating the API is running.
    """
    return {"message": "Habit API up. See /docs"}

@app.get("/health")
def health():
    """
    Health check endpoint.
    
    Returns:
        dict: Status of the API.
    """
    return {"status": "ok"}

@app.get("/habits", response_model=List[HabitResponse])
def list_habits(db: Session = Depends(get_db)):
    """
    List all habits.
    
    Args:
        db (Session): Database session injected by FastAPI Depends.
    
    Returns:
        List[HabitResponse]: A list of all habits with their logs and streaks.
    """
    habits = db.query(models.Habit).all()
    result = []
    for habit in habits:
        result.append(
            {
                "name": habit.name,
                "streak": habit.streak,
                "logs": [log.completion_date.isoformat() for log in habit.logs],
            }
        )
    return result

@app.post("/habits", response_model=HabitResponse)
def create_habit(habit: HabitCreate, db: Session = Depends(get_db)):
    """
    Create a new habit.
    
    Args:
        habit (HabitCreate): The habit data from the request body.
        db (Session): Database session.
    
    Raises:
        HTTPException: If the habit already exists (409).
    
    Returns:
        HabitResponse: The newly created habit with empty logs and streak 0.
    """
    existing = db.query(models.Habit).filter(models.Habit.name == habit.name).first()
    if existing:
        raise HTTPException(status_code=409, detail="Habit already exists")

    new_habit = models.Habit(name=habit.name, streak=0)
    db.add(new_habit)
    db.commit()
    db.refresh(new_habit)

    return {"name": new_habit.name, "streak": new_habit.streak, "logs": []}


@app.post("/habits/{name}/complete", response_model=HabitResponse)
def complete_habit(name: str, db: Session = Depends(get_db)):
    """
    Mark a habit as completed for today.

    Args:
        name (str): The name of the habit to complete.
        db (Session): Database session.

    Raises:
        HTTPException: If the habit does not exist (404).

    Returns:
        HabitResponse: Updated habit including new streak and logs.
    """
    # Find habit
    habit = db.query(models.Habit).filter(models.Habit.name == name).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    today = datetime.date.today()

    # Check if already logged today
    existing_log = (
        db.query(models.HabitLog)
        .filter(
            models.HabitLog.habit_id == habit.id,
            models.HabitLog.completion_date == today,
        )
        .first()
    )

    if existing_log:
        # Already completed today, just return current state
        return {
            "name": habit.name,
            "streak": habit.streak,
            "logs": [log.completion_date.isoformat() for log in habit.logs],
        }

    # Get all logs sorted by date
    all_logs = (
        db.query(models.HabitLog)
        .filter(models.HabitLog.habit_id == habit.id)
        .order_by(models.HabitLog.completion_date.desc())
        .all()
    )

    # Calculate new streak
    if all_logs:
        last_log_date = all_logs[0].completion_date
        days_diff = (today - last_log_date).days

        if days_diff == 1:
            # Consecutive day
            habit.streak += 1
        else:
            # Streak broken, restart
            habit.streak = 1
    else:
        # First log ever
        habit.streak = 1

    # Create new log
    new_log = models.HabitLog(habit_id=habit.id, completion_date=today)
    db.add(new_log)
    db.commit()
    db.refresh(habit)

    return {
        "name": habit.name,
        "streak": habit.streak,
        "logs": [log.completion_date.isoformat() for log in habit.logs],
    }


@app.delete("/habits/{name}")
def delete_habit(name: str, db: Session = Depends(get_db)):
    """
    Delete a habit by name.

    Args:
        name (str): The name of the habit to delete.
        db (Session): Database session.

    Raises:
        HTTPException: If the habit does not exist (404).

    Returns:
        dict: {"ok": True} on successful deletion.
    """
    habit = db.query(models.Habit).filter(models.Habit.name == name).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    db.delete(habit)
    db.commit()

    return {"ok": True}
