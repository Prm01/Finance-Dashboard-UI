import React, { useEffect, useState } from "react";
import { getMarketStatus } from "../../utils/indianMarketStatus.js";

const items = [
  { symbol: "SENSEX", price: "81,547.22", change: "+1.24%", up: true },
  { symbol: "NIFTY 50", price: "24,834.85", change: "+0.87%", up: true },
  { symbol: "USD/INR", price: "83.57", change: "-0.12%", up: false },
  { symbol: "GOLD", price: "₹72,340", change: "+0.54%", up: true },
  { symbol: "SILVER", price: "₹87,450", change: "+0.31%", up: true },
  { symbol: "BTC/INR", price: "₹59,12,400", change: "+2.14%", up: true },
  { symbol: "RELIANCE", price: "2,994.75", change: "+1.08%", up: true },
  { symbol: "TCS", price: "4,108.30", change: "-0.28%", up: false },
  { symbol: "INFY", price: "1,892.60", change: "+0.74%", up: true },
  { symbol: "HDFC BANK", price: "1,672.40", change: "+0.41%", up: true },
  { symbol: "WIPRO", price: "461.25", change: "-0.18%", up: false },
  { symbol: "NIFTY BANK", price: "52,134.50", change: "+0.63%", up: true },
  { symbol: "ITC", price: "482.15", change: "+0.29%", up: true },
  { symbol: "BAJAJ FIN", price: "6,934.80", change: "-0.45%", up: false },
  { symbol: "MARUTI", price: "12,456.00", change: "+0.92%", up: true },
];

const TickerItem = ({ symbol, price, change, up }) => (
  <span
    className="inline-flex items-center gap-2 px-6 text-xs"
    style={{ flexShrink: 0 }}
  >
    <span
      style={{
        color: "#94a3b8",
        fontWeight: 600,
        letterSpacing: "0.04em",
      }}
    >
      {symbol}
    </span>
    <span style={{ color: "#e2e8f0", fontFamily: "monospace", fontWeight: 500 }}>
      {price}
    </span>
    <span style={{ color: up ? "#10b981" : "#ef4444", fontWeight: 800, fontSize: 10 }}>
      {up ? "▲" : "▼"} {change}
    </span>
    <span style={{ color: "#334155", marginLeft: 6, fontWeight: 700 }}>|</span>
  </span>
);

const TickerBar = () => {
  const [status, setStatus] = useState(() => getMarketStatus());
  const doubled = [...items, ...items];

  useEffect(() => {
    const tick = () => setStatus(getMarketStatus());
    tick();
    const id = setInterval(tick, 60000); // Update every minute
    return () => clearInterval(id);
  }, []);

  const isOpen = status.tone === "open";
  const badgeLabel = status.label;
  const pulseColor = isOpen ? "#10b981" : "#94a3b8";
  const badgeGradient = isOpen
    ? "linear-gradient(135deg,#14b8a6,#06b6d4)"
    : "linear-gradient(135deg,#94a3b8,#64748b)";

  return (
    <div
      style={{
        height: "34px",
        background: "#0B0F14",
        borderBottom: "1px solid rgba(20,184,166,0.20)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          background: badgeGradient,
          color: "#0B0F14",
          fontSize: "9px",
          fontWeight: 800,
          letterSpacing: "0.15em",
          padding: "0 14px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          borderRight: "1px solid rgba(20,184,166,0.30)",
          gap: "5px",
        }}
      >
        <span
          className="pulse-dot"
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: pulseColor,
            display: "inline-block",
            animation: isOpen ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" : "none",
          }}
        />
        {badgeLabel}
      </div>

      <div style={{ overflow: "hidden", flex: 1 }}>
        <div className="ticker-track">
          {doubled.map((item, i) => (
            <TickerItem key={i} {...item} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default TickerBar;

