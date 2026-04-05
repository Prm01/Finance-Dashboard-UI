import React from "react";
import { motion } from "framer-motion";

export const FinanceBackground = () => {
  // Generate random orb positions for Midnight Teal animation
  const orbs = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
    xStart: Math.random() * 100,
    yStart: Math.random() * 100,
    size: 15 + Math.random() * 40,
    opacity: 0.03 + Math.random() * 0.08,
  }));

  return (
    <>
      {/* Gradient background - Midnight Dark */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-br from-bg-950 via-bg-950 to-bg-900" />

      {/* Fintech color gradient overlay - Teal & Lime */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-t from-teal-500/8 via-transparent to-lime-500/5" />

      {/* Animated fintech orbs - Subtle floating spheres */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {orbs.map((orb) => (
          <motion.div
            key={orb.id}
            className="absolute rounded-full border border-teal-500/25 backdrop-blur-sm"
            style={{
              width: orb.size,
              height: orb.size,
              left: `${orb.xStart}%`,
              top: `${orb.yStart}%`,
              opacity: orb.opacity,
              background: `radial-gradient(circle at 30% 30%, rgba(20, 184, 166, 0.15), transparent)`,
            }}
            animate={{
              y: [-30, 30, -30],
              x: [-20, 20, -20],
              rotate: 360,
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: orb.duration,
              delay: orb.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Fintech symbols */}
        {orbs.slice(0, 10).map((orb, idx) => (
          <motion.div
            key={`symbol-${idx}`}
            className="absolute font-bold text-3xl font-mono text-teal-500/30"
            style={{
              left: `${(orb.xStart + 15) % 100}%`,
              top: `${(orb.yStart + 15) % 100}%`,
            }}
            animate={{
              y: [15, -15, 15],
              opacity: [0.15, 0.35, 0.15],
              textShadow: [
                "0 0 8px rgba(20, 184, 166, 0.3)",
                "0 0 16px rgba(20, 184, 166, 0.5)",
                "0 0 8px rgba(20, 184, 166, 0.3)",
              ],
            }}
            transition={{
              duration: orb.duration + 1,
              delay: orb.delay + 0.5,
              repeat: Infinity,
            }}
          >
            ◉
          </motion.div>
        ))}
      </div>

      {/* Subtle Grid Pattern - Minimal fintech */}
      <div
        className="fixed inset-0 -z-20 opacity-[0.08] animate-slideInUp"
        style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(20, 184, 166, 0.05) 25%, rgba(20, 184, 166, 0.05) 26%, transparent 27%, transparent 74%, rgba(20, 184, 166, 0.05) 75%, rgba(20, 184, 166, 0.05) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(34, 197, 94, 0.05) 25%, rgba(34, 197, 94, 0.05) 26%, transparent 27%, transparent 74%, rgba(34, 197, 94, 0.05) 75%, rgba(34, 197, 94, 0.05) 76%, transparent 77%, transparent)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial Gradient - Top Right (Teal) */}
      <motion.div
        className="fixed top-0 right-0 h-full w-1/3 rounded-full bg-gradient-to-r from-teal-400/10 via-teal-400/3 to-transparent blur-3xl -z-10"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Radial Gradient - Bottom Left (Lime) */}
      <motion.div
        className="fixed bottom-0 left-0 h-full w-1/3 rounded-full bg-gradient-to-r from-lime-400/10 via-lime-400/3 to-transparent blur-3xl -z-10"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Center Subtle Glow - Teal accent */}
      <motion.div
        className="fixed top-1/2 left-1/2 h-2/3 w-2/3 rounded-full bg-gradient-to-r from-teal-400/8 via-teal-400/4 to-transparent blur-3xl -z-10 -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: [0.8, 1.1, 0.8],
          opacity: [0.1, 0.25, 0.1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </>
  );
};
