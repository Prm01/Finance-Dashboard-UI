import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, SettingsIcon, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../../hooks/useTransactions.js";

export const UserDropdown = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  const { state, logout, pushToast } = useAppContext();
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Only show dropdown if authenticated
  if (!state.isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    pushToast({ type: "info", title: "Signed out", message: "You can continue browsing as a guest." });
    setIsOpen(false);
  };

  const displayName = state.user?.displayName || state.user?.username || "User";
  const userInitial = displayName?.[0]?.toUpperCase() || "U";
  const roleLabel = state.role === "admin" ? "Administrator" : "Viewer";
  const roleColor = state.role === "admin" 
    ? "from-purple-400 to-indigo-500" 
    : "from-blue-400 to-cyan-500";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button with Role Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-lg dark:border-white/10 border-gray-200 dark:bg-white/5 bg-gray-50 px-3 py-1.5 text-sm font-medium dark:text-text-200 text-text-700 transition-all duration-200 dark:hover:bg-white/10 hover:bg-gray-100 border"
        aria-label="User menu"
      >
        {/* User Avatar */}
        <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-xs font-bold text-yellow-300 shadow-sm">
          {state.user?.avatarUrl ? (
            <img src={state.user.avatarUrl} alt="User avatar" className="h-full w-full rounded-full object-cover" />
          ) : (
            userInitial
          )}
        </div>
        
        {/* Role Badge - Only on desktop */}
        <span className="hidden md:inline text-xs font-semibold px-2 py-0.5 rounded-full dark:bg-white/10 bg-gray-200 dark:text-text-300 text-text-700">
          {state.role === "admin" ? "Admin" : "Viewer"}
        </span>

        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 rounded-lg dark:bg-gray-800 bg-white dark:border-white/10 border-gray-200 border shadow-lg dark:shadow-xl dark:shadow-black/30 overflow-hidden z-50"
          >
            {/* Header with User Info */}
            <div className="px-4 py-3 dark:bg-gray-900/50 bg-gray-50 border-b dark:border-white/5 border-gray-200">
              <p className="text-sm font-semibold dark:text-text-200 text-text-900">
                {displayName}
              </p>
              <p className={`text-xs mt-0.5 font-medium ${
                state.role === "admin"
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-blue-600 dark:text-blue-400"
              }`}>
                {roleLabel}
              </p>
            </div>

            {/* Info Box - Explain roles */}
            <div className="px-4 py-3 dark:bg-gray-850 bg-gray-50 border-b dark:border-white/5 border-gray-200">
              <p className="text-xs leading-relaxed dark:text-text-300 text-text-600">
                <strong>Admins</strong> can add and manage transactions.
                <br />
                <strong>Viewers</strong> can only view data.
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <button
                onClick={() => {
                  navigate("/profile");
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2.5 text-sm dark:text-text-300 text-text-700 flex items-center gap-3 transition-all duration-150 dark:hover:bg-white/5 hover:bg-gray-100"
              >
                <User size={16} className="dark:text-teal-400 text-teal-600" />
                <span>Profile</span>
              </button>

              <button
                onClick={() => {
                  navigate("/settings");
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2.5 text-sm dark:text-text-300 text-text-700 flex items-center gap-3 transition-all duration-150 dark:hover:bg-white/5 hover:bg-gray-100"
              >
                <SettingsIcon size={16} className="dark:text-lime-400 text-lime-600" />
                <span>Settings</span>
              </button>

              <div className="my-1 dark:border-white/5 border-gray-200 border-t" />

              <button
                onClick={handleLogout}
                className="w-full px-4 py-2.5 text-sm dark:text-red-400 text-red-600 flex items-center gap-3 transition-all duration-150 dark:hover:bg-red-500/10 hover:bg-red-50 font-medium"
              >
                <LogOut size={16} />
                <span>Sign out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
