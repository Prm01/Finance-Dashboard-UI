import React from "react";
import { NavLink } from "react-router-dom";

const baseStyles = "group flex items-center justify-between w-full gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200";
const inactiveStyles = "text-text-600 hover:bg-gray-100 dark:text-text-400 dark:hover:bg-white/5";
const activeStyles = "bg-teal-50 text-teal-700 border border-teal-200/70 shadow-sm dark:bg-teal-500/10 dark:text-teal-300 dark:border-teal-500/20";
const iconInactiveStyles = "flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-text-500 dark:bg-white/5 dark:text-text-400";
const iconActiveStyles = "flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-teal-200 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300";

export const SidebarItem = ({ to, label, Icon, onClick, active, indent, rightElement }) => {
  const containerClasses = [baseStyles, indent ? "pl-10" : "", active ? activeStyles : inactiveStyles]
    .filter(Boolean)
    .join(" ");
  const iconClasses = active ? iconActiveStyles : iconInactiveStyles;

  const content = (
    <>
      <div className="flex items-center gap-3">
        <span className={iconClasses}>
          <Icon size={16} />
        </span>
        <span>{label}</span>
      </div>
      {rightElement ? <span className="text-text-400 dark:text-text-500">{rightElement}</span> : null}
    </>
  );

  if (to) {
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          [baseStyles, indent ? "pl-10" : "", isActive ? activeStyles : inactiveStyles]
            .filter(Boolean)
            .join(" ")
        }
      >
        {content}
      </NavLink>
    );
  }

  return (
    <button type="button" onClick={onClick} className={containerClasses}>
      {content}
    </button>
  );
};
