import React from "react";
import { AlertCircle, Info, CheckCircle } from "lucide-react";

export const InlineAlert = ({ kind = "info", title, message }) => {
  const styles = {
    error: {
      container: "border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20",
      text: "text-red-900 dark:text-red-100",
      icon: "text-red-600 dark:text-red-500"
    },
    success: {
      container: "border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-900/20",
      text: "text-green-900 dark:text-green-100",
      icon: "text-green-600 dark:text-green-500"
    },
    info: {
      container: "border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-900 dark:text-blue-100",
      icon: "text-blue-600 dark:text-blue-500"
    },
    warning: {
      container: "border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/20",
      text: "text-amber-900 dark:text-amber-100",
      icon: "text-amber-600 dark:text-amber-500"
    }
  };

  const style = styles[kind] || styles.info;

  const IconComponent = {
    error: AlertCircle,
    success: CheckCircle,
    info: Info,
    warning: AlertCircle,
  }[kind] || Info;

  return (
    <div className={`rounded-lg border p-3 sm:p-4 flex gap-3 ${style.container}`}>
      <IconComponent size={18} className={`shrink-0 mt-0.5 ${style.icon}`} />
      <div className={`flex-1 text-sm ${style.text}`}>
        <div className="font-semibold">{title}</div>
        {message ? (
          <div className="mt-1 opacity-90 leading-relaxed">{message}</div>
        ) : null}
      </div>
    </div>
  );
};

