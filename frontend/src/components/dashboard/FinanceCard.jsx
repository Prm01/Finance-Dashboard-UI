import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Copy, Eye, EyeOff } from "lucide-react";
import { useAppContext } from "../../hooks/useTransactions.js";
import { formatCurrency } from "../../utils/formatCurrency.js";

export const FinanceCard = ({ balance = 0 }) => {
  const { state, pushToast } = useAppContext();
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [copied, setCopied] = useState(false);

  const cardNumber = "4928 7934 5812 8956";
  const maskedCardNumber = "**** **** **** 8956";
  const cardholderName = state.user?.username?.toUpperCase() || "CARDHOLDER";
  const cardLabel = "Personal Finance";

  const handleCopyCard = () => {
    navigator.clipboard.writeText(cardNumber);
    setCopied(true);
    pushToast({ type: "success", title: "Copied", message: "Card number copied to clipboard." });
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="relative"
    >
      {/* Card Container */}
      <motion.div
        whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 shadow-xl dark:shadow-black/50"
        style={{
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%)",
        }}
      >
        {/* Shine Effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100"
          style={{
            background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
            backgroundSize: "200% 200%",
            animation: "shimmer 3s infinite",
          }}
          whileHover={{ opacity: 1 }}
        />

        {/* Card Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle at 20% 50%, #14b8a6, transparent 50%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle at 80% 80%, #06b6d4, transparent 50%)",
            }}
          />
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col h-full justify-between">
          {/* Header - Logo and Type */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-cyan-400">
                <CreditCard size={16} className="text-slate-900 font-bold" />
              </div>
              <span className="text-xs font-bold tracking-widest text-cyan-300 uppercase">
                Finance Card
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              ADMIN ONLY
            </span>
          </div>

          {/* Middle - Balance */}
          <div className="space-y-3 mb-8">
            <p className="text-xs font-semibold text-slate-400/80 uppercase tracking-wider">
              Available Balance
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-white font-mono">
                {formatCurrency(balance)}
              </p>
              <span className="text-xs text-teal-300 font-medium">INR</span>
            </div>
          </div>

          {/* Card Details Row */}
          <div className="space-y-4">
            {/* Card Number with Toggle */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-400/80 uppercase tracking-wider">
                Card Number
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 font-mono text-sm text-slate-100 tracking-widest">
                  {showCardNumber ? cardNumber : maskedCardNumber}
                </div>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCardNumber(!showCardNumber)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label={showCardNumber ? "Hide card number" : "Show card number"}
                >
                  {showCardNumber ? (
                    <EyeOff size={14} className="text-slate-400" />
                  ) : (
                    <Eye size={14} className="text-slate-400" />
                  )}
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopyCard}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Copy card number"
                >
                  <Copy size={14} className={copied ? "text-teal-400" : "text-slate-400"} />
                </motion.button>
              </div>
            </div>

            {/* Cardholder and Label */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-700/50">
              <div>
                <p className="text-xs font-semibold text-slate-400/80 uppercase tracking-wider mb-1">
                  Cardholder
                </p>
                <p className="text-sm font-medium text-slate-100 font-mono truncate">
                  {cardholderName}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400/80 uppercase tracking-wider mb-1">
                  Card Label
                </p>
                <p className="text-sm font-medium text-cyan-300 truncate">
                  {cardLabel}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chip Accent */}
        <div className="absolute top-4 right-6 w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border border-yellow-500/30" />
      </motion.div>

      {/* Glow Effect Behind */}
      <motion.div
        className="absolute inset-0 rounded-3xl blur-xl opacity-0 group-hover:opacity-50 -z-10"
        style={{
          background: "linear-gradient(135deg, #14b8a6, #06b6d4)",
        }}
        whileHover={{ opacity: 0.3 }}
      />

      <style>{`
        @keyframes shimmer {
          0% { backgroundPosition: 0% 0%; }
          100% { backgroundPosition: 200% 200%; }
        }
      `}</style>
    </motion.div>
  );
};
