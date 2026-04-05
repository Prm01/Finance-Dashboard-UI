import React from "react";
import { formatCurrencyNoSign } from "../../utils/formatCurrency.js";

const formatDate = (iso) => {
  const d = iso ? new Date(iso) : null;
  if (!d || Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
};

const CATEGORY_COLORS = {
  Food: "#f59e0b",
  Rent: "#ef4444",
  Transport: "#3b82f6",
  Shopping: "#ec4899",
  Health: "#10b981",
  Utilities: "#64748b",
  Entertainment: "#8b5cf6",
  Education: "#14b8a6",
  Salary: "#6366f1",
  Freelance: "#10b981",
  Investment: "#3b82f6",
};

export const RecentTransactionsPreview = ({ transactions }) => {
  const list = React.useMemo(() => {
    const txs = Array.isArray(transactions) ? transactions : [];
    return [...txs]
      .sort((a, b) => {
        const da = a?.date ? new Date(a.date).getTime() : 0;
        const db = b?.date ? new Date(b.date).getTime() : 0;
        return db - da;
      })
      .slice(0, 5);
  }, [transactions]);

  return (
    <div className="card p-6" style={{ paddingBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.02em" }}>Recent transactions</div>
          <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4, fontWeight: 700 }}>Last 5 entries</div>
        </div>
        <div style={{ fontSize: 11, opacity: 0.5, fontWeight: 800 }}>Live</div>
      </div>

      <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        {list.length === 0 ? (
          <div style={{ fontSize: 12, opacity: 0.7 }}>No data yet.</div>
        ) : (
          list.map((t) => {
            const isIncome = t.type === "income";
            const c = CATEGORY_COLORS[t.category] || "#6366f1";
            return (
              <div
                key={t._id || t.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, opacity: 0.6, fontFamily: "monospace" }}>
                      {formatDate(t.date)}
                    </div>
                    <div
                      style={{
                        padding: "2px 10px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 900,
                        border: `1px solid ${c}30`,
                        background: `${c}18`,
                        color: c,
                      }}
                    >
                      {t.category}
                    </div>
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.86, marginTop: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 260 }}>
                    {t.description}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                    fontWeight: 900,
                    fontSize: 12,
                    color: isIncome ? "#10b981" : "#ef4444",
                    textAlign: "right",
                    whiteSpace: "nowrap",
                  }}
                >
                  {isIncome ? "+" : "-"}
                  {formatCurrencyNoSign(t.amount)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

