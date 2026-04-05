import React, { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useAppContext } from "../../hooks/useTransactions.js";
import { LayoutDashboard, BarChart3, ListChecks, Menu, X } from "lucide-react";
import { Sidebar } from "./Sidebar.jsx";
import { TopBar } from "./TopBar.jsx";
import TickerBar from "../shared/TickerBar.jsx";
import { FinancerCopilot } from "../copilot/index.js";
import { FloatingElements } from "../shared/FloatingElements.jsx";
import { FinanceBackground } from "../shared/FinanceBackground.jsx";

const nav = [
  { to: "/", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", Icon: ListChecks },
  { to: "/insights", label: "Insights", Icon: BarChart3 },
];

export const MainLayout = () => {
  const { dispatch } = useAppContext();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    const path = location.pathname;
    const page =
      path === "/"
        ? "dashboard"
        : path === "/transactions"
          ? "transactions"
          : "insights";
    dispatch({ type: "SET_PAGE", payload: page });
  }, [dispatch, location.pathname]);

  // Close menu when route changes
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-bg-base dark:bg-bg-950 text-text-primary dark:text-text-100">
      {/* Finance Background */}
      <FinanceBackground />

      {/* Floating Elements */}
      <FloatingElements />
      
      {/* Main Content */}
      <div className="relative z-20 flex min-h-screen flex-col md:flex-row">
        {/* Desktop Sidebar */}
        <aside className="hidden w-[220px] shrink-0 dark:bg-sidebar-900 bg-gray-100 dark:border-white/5 border-gray-300 border-r md:block">
          <Sidebar />
        </aside>

        {/* Mobile Sidebar Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-30 md:hidden">
            <div 
              className="absolute inset-0 dark:bg-black/70 bg-black/40 backdrop-blur-lg"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className="absolute left-0 top-0 h-full w-[220px] dark:bg-sidebar-900 bg-gray-100 dark:border-white/5 border-gray-300 border-r">
              <Sidebar />
            </aside>
          </div>
        )}

        {/* Main Content Area */}
        <div className="min-w-0 flex-1">
          {/* Top Bar with Mobile Menu Button */}
          <div className="flex items-center justify-between dark:bg-card-900 bg-white dark:border-white/5 border-gray-200 border-b px-4 py-3 sm:px-5 md:hidden shadow-sm dark:shadow-card\">
            <h1 className="text-lg font-bold dark:text-teal-400 text-teal-600">Finance Dashboard</h1>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 dark:hover:bg-teal-500/20 hover:bg-teal-100 dark:text-teal-400 text-teal-600 transition-colors duration-200 dark:hover:shadow-teal-glow"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <TickerBar />
          <TopBar />
          
          <main className="px-4 pb-20 pt-4 sm:pt-6 md:px-6 md:pb-6 md:pt-8 bg-bg-base dark:bg-bg-950">
            <div key={location.pathname} className="animate-fadeIn">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <FinancerCopilot />

      {/* Mobile Bottom Navigation - Fintech Aesthetic */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 dark:border-white/5 border-gray-200 border-t dark:bg-card-900/80 bg-white/80 backdrop-blur-lg shadow-card md:hidden">
        <div className="grid grid-cols-3">
          {nav.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  "flex flex-col items-center justify-center gap-1 px-4 py-4 text-xs font-medium transition-all duration-200",
                  isActive
                    ? "dark:text-teal-400 text-teal-600 dark:shadow-teal-glow"
                    : "dark:text-text-400 text-text-500 dark:hover:text-teal-400 hover:text-teal-600",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    className={isActive ? "dark:text-teal-400 text-teal-600 animate-subtleGlow" : "dark:text-text-400 text-text-500"}
                  />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

