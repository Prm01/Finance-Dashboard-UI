import React from "react";

export const InlineAlert = ({ kind = "info", title, message }) => {
  const styles =
    kind === "error"
      ? "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-100"
      : "border-indigo-200 bg-indigo-50 text-indigo-900 dark:border-indigo-900/50 dark:bg-indigo-900/20 dark:text-indigo-100";

  return (
    <div className={`rounded-xl border p-4 ${styles}`}>
      <div className="text-sm font-semibold">{title}</div>
      {message ? (
        <div className="mt-1 text-sm opacity-90">{message}</div>
      ) : null}
    </div>
  );
};

