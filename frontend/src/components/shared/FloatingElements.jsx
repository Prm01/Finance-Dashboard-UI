import React from "react";
import { motion } from "framer-motion";

const FloatingElement = ({ delay, duration, x, y, size, color, opacity }) => {
  return (
    <motion.div
      className="absolute rounded-full blur-2xl"
      style={{
        width: size,
        height: size,
        background: color,
        opacity,
        pointerEvents: "none",
      }}
      animate={{
        y: [0, y, 0],
        x: [0, x, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

export const FloatingElements = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <FloatingElement
        delay={0}
        duration={20}
        x={50}
        y={100}
        size={300}
        color="rgba(99, 102, 241, 0.15)"
        opacity={0.3}
      />
      <FloatingElement
        delay={2}
        duration={25}
        x={-60}
        y={80}
        size={250}
        color="rgba(16, 185, 129, 0.12)"
        opacity={0.25}
      />
      <FloatingElement
        delay={4}
        duration={30}
        x={40}
        y={-100}
        size={200}
        color="rgba(59, 130, 246, 0.10)"
        opacity={0.2}
      />
    </div>
  );
};
