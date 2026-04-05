import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ExternalLink } from "lucide-react";
import { CopilotHeader } from "./CopilotHeader.jsx";
import { CopilotMessage } from "./CopilotMessage.jsx";
import { CopilotSuggestions } from "./CopilotSuggestions.jsx";
import { CopilotInput } from "./CopilotInput.jsx";

export const CopilotPanel = ({
  open,
  onClose,
  messages,
  input,
  onInputChange,
  onSend,
  onSuggestion,
  typing,
}) => (
  <AnimatePresence>
    {open ? (
      <>
        <motion.button
          type="button"
          aria-label="Dismiss overlay"
          className="fixed inset-0 z-[55] bg-black/25 backdrop-blur-[2px] md:bg-black/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="financer-title"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="fixed bottom-[5.5rem] left-3 right-3 z-[58] flex max-h-[min(72vh,520px)] flex-col overflow-hidden rounded-2xl border border-gray-200/90 bg-white/95 shadow-2xl shadow-gray-900/15 backdrop-blur-xl dark:border-white/10 dark:bg-card-900/95 dark:shadow-black/40 md:left-auto md:right-6 md:w-[400px] md:max-w-[calc(100vw-2rem)]"
          onClick={(e) => e.stopPropagation()}
        >
          <span id="financer-title" className="sr-only">
            Financer finance copilot
          </span>
          <CopilotHeader onClose={onClose} />
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 ? (
              <div className="space-y-4 px-1">
                <div>
                  <p className="text-[13px] font-semibold leading-snug text-gray-900 dark:text-gray-100">
                    Hi — I'm Financer, your finance copilot.
                  </p>
                  <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400 mt-1.5">
                    Powered by AI to analyze spending, find trends, and answer your finance questions instantly. I work with your dashboard data only.
                  </p>
                </div>
                <a
                  href="https://ai.google.dev/gemini-api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                >
                  <Zap size={12} />
                  <span>Powered by Gemini AI</span>
                  <ExternalLink size={10} />
                </a>
              </div>
            ) : (
              messages.map((m, i) => <CopilotMessage key={`${m.role}_${i}`} role={m.role} text={m.text} />)
            )}
            {typing ? (
              <div className="px-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">Financer is thinking…</div>
            ) : null}
          </div>
          <CopilotSuggestions onPick={onSuggestion} disabled={typing} />
          <CopilotInput
            value={input}
            onChange={onInputChange}
            onSend={onSend}
            disabled={typing}
            placeholder="Ask about spending, savings, or trends…"
          />
        </motion.div>
      </>
    ) : null}
  </AnimatePresence>
);
