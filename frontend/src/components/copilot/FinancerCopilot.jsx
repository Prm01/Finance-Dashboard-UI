import React from "react";
import { useLocation } from "react-router-dom";
import { useAppContext } from "../../hooks/useTransactions.js";
import { generateFinalCopilotResponse } from "../../assistant/assistantResponses.js";
import { CopilotTrigger } from "./CopilotTrigger.jsx";
import { CopilotPanel } from "./CopilotPanel.jsx";

const FinancerCopilot = () => {
  const { pathname } = useLocation();
  const { state, assistantDashboardRange } = useAppContext();
  const { transactions, loading, filters } = state;

  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [typing, setTyping] = React.useState(false);
  const [messages, setMessages] = React.useState([]);

  const send = async (raw) => {
    const q = String(raw || "").trim();
    if (!q || typing) return;

    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setInput("");
    setTyping(true);

    try {
      const { text } = await generateFinalCopilotResponse(q, transactions, {
        loading,
        pathname,
        filters,
        assistantDashboardRange,
        now: new Date(),
      });
      setMessages((prev) => [...prev, { role: "assistant", text }]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Something went wrong. I can only answer using your dashboard data — please try again.",
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      <CopilotTrigger open={open} onClick={() => setOpen((o) => !o)} />
      <CopilotPanel
        open={open}
        onClose={() => setOpen(false)}
        messages={messages}
        input={input}
        onInputChange={setInput}
        onSend={() => send(input)}
        onSuggestion={(label) => send(label)}
        typing={typing}
      />
    </>
  );
};

export default FinancerCopilot;
