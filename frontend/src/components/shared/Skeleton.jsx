import React from "react";

export const Skeleton = ({ className = "", heightClassName = "h-4" }) => {
  return (
    <div
      className={[
        "animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700",
        heightClassName,
        className,
      ].join(" ")}
    />
  );
};

