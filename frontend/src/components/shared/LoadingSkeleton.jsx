import React from "react";

const Skeleton = ({ className = "", style = {} }) => (
  <div className={`skeleton ${className}`} style={style} />
);

export const SummaryCardsSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {[0, 1, 2, 3].map((i) => (
      <div key={i} className="card" style={{ animationDelay: `${i * 80}ms` }}>
        <Skeleton style={{ height: 12, width: "60%", marginBottom: 12 }} />
        <Skeleton style={{ height: 32, width: "80%" }} />
      </div>
    ))}
  </div>
);

export const ChartSkeleton = () => (
  <div className="card">
    <Skeleton style={{ height: 16, width: "40%", marginBottom: 20 }} />
    <Skeleton style={{ height: 240, width: "100%" }} />
  </div>
);

export const TableSkeleton = () => (
  <div className="card p-0 overflow-hidden" style={{ padding: 0 }}>
    <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(99,102,241,0.08)" }}>
      <Skeleton style={{ height: 13, width: 200 }} />
    </div>
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        style={{
          display: "flex",
          gap: 20,
          padding: "16px 20px",
          borderBottom: "1px solid rgba(99,102,241,0.05)",
        }}
      >
        <Skeleton style={{ height: 13, width: 90, flexShrink: 0 }} />
        <Skeleton style={{ height: 13, width: "auto", flex: 1 }} />
        <Skeleton style={{ height: 13, width: 70, flexShrink: 0 }} />
        <Skeleton style={{ height: 13, width: 60, flexShrink: 0 }} />
        <Skeleton style={{ height: 13, width: 80, flexShrink: 0 }} />
      </div>
    ))}
  </div>
);

export default Skeleton;

