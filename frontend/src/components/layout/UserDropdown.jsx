import React from "react";
import { ChevronDown, LogOut, SettingsIcon, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../../hooks/useTransactions.js";

export const UserDropdown = () => {
  const [isOpen, setIsOpen] = React.useState(false);
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

  if (!state.isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    pushToast({ type: "info", title: "Signed out", message: "You can keep browsing as a guest." });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-lg dark:border-white/10 border-gray-200 dark:bg-white/5 bg-gray-50 px-3 py-1.5 text-sm font-medium dark:text-text-200 text-text-700 transition-all duration-200 dark:hover:bg-white/10 hover:bg-gray-100 border"
        aria-label="User menu"
      >
        <div className="w-6 h-6 rounded-full dark:bg-gradient-to-br dark:from-teal-400 dark:to-lime-400 bg-gradient-to-br from-teal-500 to-lime-500 flex items-center justify-center text-xs font-bold dark:text-gray-900 text-white">
          {state.user?.username?.[0]?.toUpperCase() || "U"}
        </div>
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
            className="absolute right-0 mt-2 w-48 rounded-lg dark:bg-gray-800 bg-white dark:border-white/10 border-gray-200 border shadow-lg dark:shadow-xl dark:shadow-black/30 overflow-hidden z-50"
          >
            {/* Header with User Info */}
            <div className="px-4 py-3 dark:bg-gray-900/50 bg-gray-50 border-b dark:border-white/5 border-gray-200">
              <p className="text-sm font-semibold dark:text-text-200 text-text-900">
                {state.user?.username}
              </p>
              <p className="text-xs dark:text-text-400 text-text-500 mt-0.5">
                {state.role === "admin" ? "Administrator" : "Viewer"}
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <button
                onClick={() => {
                  pushToast({ type: "info", title: "Coming soon", message: "Profile settings will be available soon." });
                }}
                className="w-full px-4 py-2 text-sm dark:text-text-300 text-text-700 flex items-center gap-3 transition-all duration-150 dark:hover:bg-white/5 hover:bg-gray-100"
              >
                <User size={16} className="dark:text-teal-400 text-teal-600" />
                <span>Profile</span>
              </button>

              <button
                onClick={() => {
                  pushToast({ type: "info", title: "Coming soon", message: "Settings will be available soon." });
                }}
                className="w-full px-4 py-2 text-sm dark:text-text-300 text-text-700 flex items-center gap-3 transition-all duration-150 dark:hover:bg-white/5 hover:bg-gray-100"
              >
                <SettingsIcon size={16} className="dark:text-lime-400 text-lime-600" />
                <span>Settings</span>
              </button>

              <div className="my-1 dark:border-white/5 border-gray-200 border-t" />

              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm dark:text-red-400 text-red-600 flex items-center gap-3 transition-all duration-150 dark:hover:bg-red-500/10 hover:bg-red-50"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
