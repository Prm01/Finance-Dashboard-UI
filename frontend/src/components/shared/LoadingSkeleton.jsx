import React from "react";
import { motion } from "framer-motion";

const Skeleton = ({ className = "", style = {} }) => (
  <motion.div
    className={`skeleton bg-gradient-to-r dark:from-gray-700 dark:to-gray-600 from-gray-200 to-gray-100 ${className}`}
    style={style}
    animate={{ opacity: [0.6, 0.4, 0.6] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
  />
);

export const SummaryCardsSkeleton = () => (
  <motion.div
    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    {[0, 1, 2, 3].map((i) => (
      <motion.div
        key={i}
        className="rounded-lg border dark:border-white/5 border-gray-200 dark:bg-gray-800 bg-white p-6 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: i * 0.08 }}
      >
        <Skeleton className="rounded h-4 w-24" />
        <Skeleton className="rounded h-6 w-32" />
        <Skeleton className="rounded h-3 w-full" />
      </motion.div>
    ))}
  </motion.div>
);

export const ChartSkeleton = () => (
  <motion.div
    className="rounded-lg border dark:border-white/5 border-gray-200 dark:bg-gray-800/50 bg-white p-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <Skeleton className="rounded h-4 w-40 mb-6" />
    <Skeleton className="rounded h-64 w-full" />
  </motion.div>
);

export const TableSkeleton = () => (
  <motion.div
    className="rounded-lg border dark:border-white/5 border-gray-200 dark:bg-gray-800/50 bg-white overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    {/* Header */}
    <div className="px-6 py-4 border-b dark:border-white/5 border-gray-200 flex gap-4">
      <Skeleton className="rounded h-4 w-20" />
      <Skeleton className="rounded h-4 w-32 flex-1" />
      <Skeleton className="rounded h-4 w-20" />
      <Skeleton className="rounded h-4 w-20" />
    </div>

    {/* Rows */}
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <motion.div
        key={i}
        className="px-6 py-4 border-b dark:border-white/5 border-gray-100 flex gap-4 items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: i * 0.05 }}
      >
        <Skeleton className="rounded h-3 w-20 shrink-0" />
        <Skeleton className="rounded h-3 w-32 flex-1" />
        <Skeleton className="rounded h-3 w-20 shrink-0" />
        <Skeleton className="rounded h-3 w-16 shrink-0" />
      </motion.div>
    ))}
  </motion.div>
);

export default Skeleton;

