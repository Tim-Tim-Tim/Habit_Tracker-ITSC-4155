import datetime
from datetime import timedelta
from typing import List, Optional

import models
from auth import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    authenticate_user,
    create_access_token,
    get_current_active_user,
    get_password_hash,
    get_user_by_email,
    get_user_by_username,
)
from database import Base, engine, get_db
from domain import HabitTracker
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Habit API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://habit-tracker-itsc-4155.vercel.app"
    ],  # Vercel front-end URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

tracker = HabitTracker()


# Pydantic schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    is_active: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True


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
    return {"message": "Habit API up. See /docs"}


@app.get("/health")
def health():
    return {"status": "ok"}


# Authentication Endpoints
@app.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    # Check if username already exists
    if get_user_by_username(db, user.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )

    # Check if email already exists
    if get_user_by_email(db, user.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    # Create new user with hashed password
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        username=user.username, email=user.email, hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


@app.post("/token", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    """Login endpoint - returns JWT token."""
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/users/me", response_model=UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_active_user)):
    """Get current user information."""
    return current_user


# Habit Endpoints (require authentication)
@app.get("/habits", response_model=List[HabitResponse])
def list_habits(
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """List all habits for the current user."""
    habits = (
        db.query(models.Habit).filter(models.Habit.user_id == current_user.id).all()
    )

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
def create_habit(
    habit: HabitCreate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Create a new habit for the current user."""
    # Check if habit already exists for this user
    existing = (
        db.query(models.Habit)
        .filter(
            models.Habit.name == habit.name, models.Habit.user_id == current_user.id
        )
        .first()
    )

    if existing:
        raise HTTPException(status_code=409, detail="Habit already exists")

    # Create new habit
    new_habit = models.Habit(name=habit.name, user_id=current_user.id, streak=0)
    db.add(new_habit)
    db.commit()
    db.refresh(new_habit)

    return {"name": new_habit.name, "streak": new_habit.streak, "logs": []}


@app.post("/habits/{name}/complete", response_model=HabitResponse)
def complete_habit(
    name: str,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Mark a habit as complete for today."""
    # Find habit for current user
    habit = (
        db.query(models.Habit)
        .filter(models.Habit.name == name, models.Habit.user_id == current_user.id)
        .first()
    )

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
            habit.streak += 1
        else:
            habit.streak = 1
    else:
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
def delete_habit(
    name: str,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Delete a habit for the current user."""
    habit = (
        db.query(models.Habit)
        .filter(models.Habit.name == name, models.Habit.user_id == current_user.id)
        .first()
    )

    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    db.delete(habit)
    db.commit()

    return {"ok": True}
