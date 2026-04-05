import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../hooks/useTransactions.js";
import { CalendarDays, LogIn, Moon, Sun, UserPlus, Search } from "lucide-react";
import { UserDropdown } from "./UserDropdown.jsx";

const titleByPage = {
  dashboard: "Dashboard",
  transactions: "Transactions",
  insights: "Insights",
};

export const TopBar = () => {
  const { state, dispatch, logout, pushToast } = useAppContext();

  const [theme, setTheme] = React.useState(() => {
    const stored = localStorage.getItem("fd_theme");
    return stored === "dark" ? "dark" : "light";
  });

  const [searchQuery, setSearchQuery] = React.useState(state.filters?.search || "");

  React.useEffect(() => {
    setSearchQuery(state.filters?.search || "");
  }, [state.filters?.search]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: "SET_FILTERS", payload: { search: searchQuery } });
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, dispatch]);

  React.useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("fd_theme", theme);
  }, [theme]);

  const now = new Date();
  const dateLabel = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(now);

  const isAuthed = state.isAuthenticated;

  return (
    <div className="sticky top-0 z-10 dark:border-white/5 border-gray-200 border-b dark:bg-gray-950 bg-white shadow-sm dark:shadow-lg dark:shadow-black/20">
      <div className="px-4 py-3 sm:px-6 md:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Title + Date */}
          <div className="min-w-fit">
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r dark:from-teal-400 dark:via-lime-400 dark:to-teal-400 from-teal-600 via-lime-600 to-teal-600 bg-clip-text text-transparent">
              {titleByPage[state.activePage] || "Finance Dashboard"}
            </h1>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs dark:text-text-400 text-text-500">
              <CalendarDays size={12} />
              <span>{dateLabel}</span>
            </div>
          </div>

          {/* Center: Search Bar (Only when authenticated) */}
          {isAuthed && (
            <div className="hidden md:block flex-1 max-w-xs">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-text-500 text-text-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search transactions..."
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-lg dark:bg-white/5 bg-gray-100 dark:border-white/10 border-gray-200 border dark:text-text-200 text-text-900 dark:placeholder-text-600 placeholder-text-400 transition-all duration-200 dark:hover:bg-white/8 hover:bg-gray-200 dark:focus:bg-white/10 focus:bg-white focus:outline-none focus:ring-2 dark:focus:ring-teal-500/30 focus:ring-teal-400/30"
                />
              </div>
            </div>
          )}

          {/* Right: Theme Toggle + Auth Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {!isAuthed ? (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 rounded-lg border dark:border-teal-500/30 border-teal-400/40 dark:bg-teal-500/10 bg-teal-100 px-3 py-1.5 text-xs sm:text-sm font-medium dark:text-teal-300 text-teal-700 transition-all duration-200 dark:hover:border-teal-500/50 hover:border-teal-400/60 dark:hover:bg-teal-500/15 hover:bg-teal-200"
                >
                  <LogIn size={14} />
                  <span className="hidden sm:inline">Sign in</span>
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-1.5 rounded-lg dark:bg-gradient-to-r dark:from-teal-500 dark:to-lime-500 bg-gradient-to-r from-teal-600 to-lime-600 px-3 py-1.5 text-xs sm:text-sm font-semibold dark:text-gray-900 text-white transition-all duration-200 dark:hover:shadow-teal-glow-hover"
                >
                  <UserPlus size={14} />
                  <span className="hidden sm:inline">Register</span>
                </Link>
              </>
            ) : (
              <>
                {/* Theme Toggle Button */}
                <button
                  type="button"
                  onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
                  className="inline-flex items-center justify-center rounded-lg dark:border-white/10 border-gray-200 dark:bg-white/5 bg-gray-50 w-8 h-8 sm:w-9 sm:h-9 transition-all duration-200 dark:hover:bg-white/10 hover:bg-gray-100 border"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <Sun size={16} className="dark:text-lime-400 text-lime-600" />
                  ) : (
                    <Moon size={16} className="dark:text-lime-400 text-lime-600" />
                  )}
                </button>

                {/* User Dropdown */}
                <UserDropdown />
              </>
            )}
          </div>
        </div>

        {/* Mobile Search Bar (when authenticated) */}
        {isAuthed && (
          <div className="block md:hidden mt-3 pt-3 border-t dark:border-white/5 border-gray-200">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-text-500 text-text-400" />
              <input
                type="text"
                placeholder="Search transactions, categories..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-lg dark:bg-white/5 bg-gray-100 dark:border-white/10 border-gray-200 border dark:text-text-200 text-text-900 dark:placeholder-text-600 placeholder-text-400 transition-all duration-200 dark:hover:bg-white/8 hover:bg-gray-200 dark:focus:bg-white/10 focus:bg-white focus:outline-none focus:ring-2 dark:focus:ring-teal-500/30 focus:ring-teal-400/30"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
