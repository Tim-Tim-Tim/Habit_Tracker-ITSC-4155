import React, { useState, useEffect } from "react";
import { authApi } from "./api/authApi";
import { habitApi } from "./api/habitApi";
import LoginView from "./components/LoginView";
import SignupView from "./components/SignupView";
import ProfileView from "./components/ProfileView";
import Dashboard from "./components/Dashboard";
import HabitDetailView from "./components/HabitDetailView";
import HabitModal from "./components/HabitModal";
import {
  Plus,
  X,
  Activity,
  Brain,
  Flame,
  Check,
  ChevronRight,
  Trash2,
  LogOut,
  Calendar,
  Briefcase,
  Coffee,
  PieChart,
  BarChart2,
  BookOpen,
  Moon,
  Sun,
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
} from "lucide-react";


// Recompute streak from a list of date strings (YYYY-MM-DD)
function computeStreakFromLogs(logs) {
  if (!Array.isArray(logs) || logs.length === 0) return 0;

  // sort
  const dates = logs
    .map((d) => new Date(d))
    .filter((d) => !isNaN(d))
    .sort((a, b) => a - b);

  if (!dates.length) return 0;

  let streak = 1;

  // Walk backwards from the most recent date
  for (let i = dates.length - 1; i > 0; i--) {
    const diffMs = dates[i] - dates[i - 1];
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * MAIN APP
 */
export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );
  const [view, setView] = useState("dashboard");
  const [authView, setAuthView] = useState("login");
  const [darkMode, setDarkMode] = useState(false);
  const [habits, setHabits] = useState([]);
  const [selectedName, setSelectedName] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authError, setAuthError] = useState("");

  const [completingName, setCompletingName] = useState(null);
  const [deletingName, setDeletingName] = useState(null);

  //DEMO SIMULATION 
  // When simHabits is non-null, we are in "demo mode"
  const [simHabits, setSimHabits] = useState(null);
  const [simDays, setSimDays] = useState(0);

  // Habits we actually render everywhere
  const displayHabits = simHabits || habits;

  // "Today" in the UI. When simHabits is active, we shift back by simDays.
  const getCurrentSimDateStr = () => {
    const d = new Date();
    if (simHabits) {
      d.setDate(d.getDate() - simDays);
    }
    return d.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (token) {
      fetchUser();
      fetchHabits();
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await authApi.me();
      const userData = res.data;
      // Backend returns: id, username, email, is_active, created_at
      userData.name = userData.email
        ? userData.email.split("@")[0]
        : userData.username;
      setUser(userData);
    } catch {
      handleLogout();
    }
  };

  const fetchHabits = async () => {
    try {
      const res = await habitApi.getAll();
      const serverHabits = Array.isArray(res.data)
        ? res.data
        : [];
      // Add a default category just for styling
      const mapped = serverHabits.map((h) => ({
        ...h,
        category: "Health",
      }));
      setHabits(mapped);

      // Any time we refetch from backend, drop demo state
      setSimHabits(null);
      setSimDays(0);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = async (email, password) => {
    setAuthError("");
    try {
      const res = await authApi.login(email, password);
      localStorage.setItem("token", res.access_token);
      setToken(res.access_token);
    } catch (err) {
      console.error(err);
      setAuthError(
        "Login failed. Please check your email and password."
      );
    }
  };

  const handleSignup = async (name, email, password) => {
    setAuthError("");
    try {
      await authApi.signup(name, email, password);
      const res = await authApi.login(email, password);
      localStorage.setItem("token", res.access_token);
      setToken(res.access_token);
    } catch (err) {
      console.error(err);
      setAuthError(
        "Signup failed. Email may already be registered."
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setHabits([]);
    setSimHabits(null);
    setSimDays(0);
    setAuthView("login");
  };

  const handleSaveHabit = async (name, category) => {
    try {
      const res = await habitApi.create(name);
      const created = res.data; // { name, streak, logs: [] }
      const newHabit = {
        ...created,
        category: category || "Health",
      };

      setHabits((prev) => [...prev, newHabit]);

      // If we were in demo mode, also add to simHabits base
      setSimHabits((prev) =>
        prev ? [...prev, { ...newHabit }] : null
      );
    } catch (e) {
      console.error(e);
    }
  };

  // Complete "today's" habit
  // If we are in DEMO mode, we only update the
  // simulated data and DO NOT hit the backend.
  const handleCompleteToday = async (name) => {
    const todayStr = getCurrentSimDateStr();

    // DEMO MODE: only touch simulated data
    if (simHabits) {
      setSimHabits((prev) =>
        prev.map((h) => {
          if (h.name !== name) return h;
          const logs = Array.isArray(h.logs)
            ? [...h.logs]
            : [];
          if (!logs.includes(todayStr)) {
            logs.push(todayStr);
            logs.sort();
          }
          const streak = computeStreakFromLogs(logs);
          return { ...h, logs, streak };
        })
      );
      return;
    }

    // NORMAL MODE: talk to backend (which uses real "today")
    try {
      const res = await habitApi.completeToday(name);
      const updated = res.data; // { name, streak, logs }
      setHabits((prev) =>
        prev.map((h) =>
          h.name === name
            ? {
                ...h,
                streak: updated.streak,
                logs: updated.logs,
              }
            : h
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteHabit = async (name) => {
    if (!window.confirm("Delete this habit?")) return;
    try {
      await habitApi.delete(name);
      setHabits((prev) =>
        prev.filter((h) => h.name !== name)
      );
      setSimHabits((prev) =>
        prev ? prev.filter((h) => h.name !== name) : null
      );
      setView("dashboard");
    } catch (e) {
      console.error("Failed to delete", e);
      alert(
        "Failed to delete habit. Ensure backend is running."
      );
    }
  };

  // --- DEMO CONTROLS ---
  const handlePassDayDemo = () => {
    const base = simHabits || habits;
    if (!base || base.length === 0) return;

    if (!simHabits) {
      // First click: enter demo mode, snapshot current habits
      setSimHabits(
        base.map((h) => ({
          ...h,
          logs: Array.isArray(h.logs) ? [...h.logs] : [],
        }))
      );
      setSimDays(1);
    } else {
      // Subsequent clicks: just move the day forward by one
      setSimDays((d) => d + 1);
    }
  };

  const handleResetDemo = () => {
    setSimHabits(null);
    setSimDays(0);
  };

  const activeHabit = displayHabits.find(
    (h) => h.name === selectedName
  );

  const Header = () => (
    <header className="flex items-center justify-between px-6 py-4 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-40 border-b border-gray-100 dark:border-slate-800 transition-colors">
      <div className="flex items-center gap-8">
        <button
          onClick={() => setView("dashboard")}
          className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight hover:opacity-80 transition-opacity"
        >
          Habit
          <span className="text-blue-600 dark:text-blue-400">
            Tracker
          </span>
        </button>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 text-gray-400 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        {user && (
          <button
            onClick={() => setView("profile")}
            className="flex items-center gap-3 pl-1 pr-4 py-1 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full border border-gray-200 dark:border-slate-700 transition-all group"
          >
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm group-hover:scale-105 transition-transform">
              {user.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <span className="text-sm font-bold text-gray-700 dark:text-slate-300 hidden sm:inline">
              {user.name}
            </span>
          </button>
        )}
      </div>
    </header>
  );

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-sans text-gray-900 dark:text-white selection:bg-blue-100 dark:selection:bg-blue-900 transition-colors duration-300">
        <Header />
        <main>
          {!user ? (
            authView === "login" ? (
              <LoginView
                onLogin={handleLogin}
                onSwitchToSignup={() => setAuthView("signup")}
                authError={authError}
              />
            ) : (
              <SignupView
                onSignup={handleSignup}
                onSwitchToLogin={() => setAuthView("login")}
                authError={authError}
              />
            )
          ) : (
            <>
              {view === "dashboard" && (
                <>
                  {displayHabits.length > 0 && (
                    <div className="max-w-4xl mx-auto px-6 mt-4 mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 dark:text-slate-400">
                      <span>
                        Demo tools (frontend only): simulated extra
                        days: <strong>{simDays}</strong>
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handlePassDayDemo}
                          className="px-3 py-1 rounded-full border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 font-semibold"
                        >
                          Pass day (demo)
                        </button>
                        {simHabits && (
                          <button
                            type="button"
                            onClick={handleResetDemo}
                            className="px-3 py-1 rounded-full border border-transparent bg-transparent hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 dark:text-slate-500"
                          >
                            Reset demo
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <Dashboard
                    user={user}
                    habits={displayHabits}
                    onAdd={() => setIsModalOpen(true)}
                    onSelect={(name) => {
                      setSelectedName(name);
                      setView("habit-detail");
                    }}
                    onToggle={handleCompleteToday}
                    completingName={completingName}
                    deletingName={deletingName}
                    currentDateStr={getCurrentSimDateStr()}
                  />
                </>
              )}
              {view === "habit-detail" && activeHabit && (
                <HabitDetailView
                  habit={activeHabit}
                  onBack={() => setView("dashboard")}
                  onToggleToday={handleCompleteToday}
                  onDelete={handleDeleteHabit}
                />
              )}
              {view === "profile" && (
                <ProfileView
                  user={user}
                  habits={displayHabits}
                  onLogout={handleLogout}
                />
              )}
            </>
          )}
        </main>
        <HabitModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveHabit}
        />
      </div>
    </div>
  );
}


