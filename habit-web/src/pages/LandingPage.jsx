
import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(1200px_800px_at_20%_-10%,#1a2028_0%,#0f1216_45%)] text-slate-100">
      <div className="w-[min(800px,92vw)] text-center px-8 py-12 rounded-[14px] bg-slate-900/70 border border-slate-800/70 shadow-xl">
        <h1 className="m-0 text-[2.1rem] font-extrabold text-sky-300">
          Habit Tracker
        </h1>

        <p className="mt-3 text-slate-400">
          Track your habits, stay consistent, and build great routines.
        </p>

        <div className="mt-7 flex justify-center gap-3">
          <Link
            to="/app"
            aria-label="Login"
            className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all active:scale-95"
          >
            Login
          </Link>

          <Link
            to="/app"
            aria-label="Register"
            className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold border border-slate-600/80 text-slate-200 bg-transparent hover:bg-slate-800/60 transition-all active:scale-95"
          >
            Register
          </Link>
        </div>

        <div className="mt-6 text-slate-400 text-sm text-center">
          <small>Don't have an account? Use the Register button.</small>
        </div>

        <footer className="mt-8 border-t border-slate-800 pt-4 text-xs text-slate-500 text-center">
          <p>© 2025 TJ, Nathaniel, Ryan, Mohamed, Sweta</p>
        </footer>
      </div>
    </div>
  );
}
