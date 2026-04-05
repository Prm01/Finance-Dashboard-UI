import React from "react";

const variantStyles = {
  income: "bg-lime-500/15 text-lime-400 border-lime-500/30",
  expense: "bg-red-500/15 text-red-400 border-red-500/30",
  neutral: "bg-text-400/10 text-text-300 border-white/10 dark:bg-text-400/5 dark:text-text-400 dark:border-white/5",
  admin: "bg-lime-500/15 text-lime-400 border-lime-500/30",
  viewer: "bg-teal-500/15 text-teal-400 border-teal-500/30",
};

export const Badge = ({ children, variant = "neutral", className = "" }) => {
  const styles = variantStyles[variant] || variantStyles.neutral;
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        styles,
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
};

