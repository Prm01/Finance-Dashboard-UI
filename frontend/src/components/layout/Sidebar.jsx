import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../hooks/useTransactions.js";
import {
  LayoutDashboard,
  ListChecks,
  BarChart3,
  Wallet,
  PieChart,
  User,
  Settings,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { SidebarItem } from "./SidebarItem.jsx";

const sectionLabelClasses =
  "text-[11px] font-semibold uppercase tracking-[0.2em] text-text-400 dark:text-text-500";

export const Sidebar = () => {
  const { state, dispatch, logout, pushToast } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const displayName = state.isAuthenticated ? state.user?.username || "User" : "Finance";
  const roleLabel = state.role === "admin" ? "Admin" : "Viewer";

  const [expanded, setExpanded] = useState({
    transactions: location.pathname.startsWith("/transactions"),
    insights: location.pathname.startsWith("/insights"),
  });

  useEffect(() => {
    setExpanded((prev) => ({
      ...prev,
      transactions: location.pathname.startsWith("/transactions") ? true : prev.transactions,
      insights: location.pathname.startsWith("/insights") ? true : prev.insights,
    }));
  }, [location.pathname]);

  const setTransactionFilter = (type) => {
    dispatch({ type: "SET_FILTERS", payload: { type, search: "" } });
    navigate("/transactions");
  };

  const handlePlaceholder = (label) => {
    pushToast({ type: "info", title: label, message: "This feature is coming soon in the next product update." });
  };

  const sections = [
    {
      title: "Main",
      items: [
        { to: "/", label: "Dashboard", Icon: LayoutDashboard },
        {
          label: "Transactions",
          Icon: ListChecks,
          key: "transactions",
          hasSubmenu: true,
          subItems: [
            { label: "All transactions", to: "/transactions", onAction: () => setTransactionFilter("all") },
            { label: "Income", to: "/transactions", onAction: () => setTransactionFilter("income") },
            { label: "Expenses", to: "/transactions", onAction: () => setTransactionFilter("expense") },
          ],
        },
        { to: "/insights", label: "Insights", Icon: BarChart3, key: "insights", hasSubmenu: false },
      ],
    },
    {
      title: "Tools",
      items: [
        { label: "Financer", Icon: Wallet, onAction: () => handlePlaceholder("Financer") },
        { label: "Budgets", Icon: PieChart, onAction: () => handlePlaceholder("Budgets") },
      ],
    },
    {
      title: "Account",
      items: [
        { label: "Profile", Icon: User, onAction: () => handlePlaceholder("Profile") },
        { label: "Settings", Icon: Settings, onAction: () => handlePlaceholder("Settings") },
      ],
    },
  ];

  const roleBadge = (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-text-300">
      {roleLabel}
    </span>
  );

  return (
    <div className="flex h-full flex-col bg-white/95 dark:bg-slate-950/95 border-r border-gray-200/70 dark:border-white/10 shadow-sm shadow-slate-900/5">
      <div className="px-4 py-5 border-b border-gray-200/70 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-gradient-to-br from-teal-500 to-lime-400 text-lg font-bold text-white shadow-lg shadow-teal-500/10">
            ₹
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{displayName}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Finance workspace</p>
          </div>
        </div>
        <div className="mt-4">{roleBadge}</div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="space-y-3">
            <div className={sectionLabelClasses}>{section.title}</div>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isOpen = item.key ? expanded[item.key] : false;
                const isActiveParent = item.key ? location.pathname.startsWith(`/${item.key}`) : false;
                if (item.hasSubmenu && Array.isArray(item.subItems)) {
                  return (
                    <div key={item.label} className="space-y-1">
                      <SidebarItem
                        label={item.label}
                        Icon={item.Icon}
                        active={isActiveParent}
                        onClick={() => setExpanded((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                        rightElement={<ChevronDown size={14} className={`${isOpen ? "rotate-180" : ""} transition-transform duration-200`} />}
                      />
                      {isOpen && (
                        <div className="space-y-1 px-1">
                          {item.subItems.map((subItem) => (
                            <SidebarItem
                              key={subItem.label}
                              label={subItem.label}
                              Icon={ListChecks}
                              indent
                              onClick={subItem.onAction}
                              active={
                                location.pathname === "/transactions" &&
                                state.filters.type ===
                                  (subItem.label === "Income"
                                    ? "income"
                                    : subItem.label === "Expenses"
                                    ? "expense"
                                    : "all")
                              }
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                if (item.to) {
                  return (
                    <SidebarItem key={item.label} to={item.to} label={item.label} Icon={item.Icon} />
                  );
                }

                return (
                  <SidebarItem
                    key={item.label}
                    label={item.label}
                    Icon={item.Icon}
                    onClick={item.onAction}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto border-t border-gray-200/70 dark:border-white/10 px-4 py-4">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-3.5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-slate-800"
        >
          <LogOut size={16} />
          Logout
        </button>
        <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
          Your workspace is optimized for a clean finance experience with minimal clutter.
        </p>
      </div>
    </div>
  );
};

