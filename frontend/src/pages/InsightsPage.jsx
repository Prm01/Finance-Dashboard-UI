import React from "react";
import { useAppContext } from "../hooks/useTransactions.js";
import { InsightsPanel } from "../components/insights/InsightsPanel.jsx";
import { EmptyState } from "../components/shared/EmptyState.jsx";
import { Skeleton } from "../components/shared/Skeleton.jsx";
import { InlineAlert } from "../components/shared/InlineAlert.jsx";

export const InsightsPage = () => {
  const { state } = useAppContext();
  const { loading, error, notice, transactions } = state;

  return (
    <div className="space-y-5">
      {loading ? (
        <div className="space-y-5">
          <Skeleton className="h-[140px] w-full rounded-xl" heightClassName="h-[140px]" />
          <Skeleton className="h-[260px] w-full rounded-xl" heightClassName="h-[260px]" />
          <Skeleton className="h-[220px] w-full rounded-xl" heightClassName="h-[220px]" />
        </div>
      ) : error ? (
        <EmptyState title="Unable to load insights" description={error} />
      ) : null}

      {!loading && !error && notice ? (
        <InlineAlert kind="info" title="Demo mode" message={notice} />
      ) : null}

      {!loading && !error ? (
        <InsightsPanel transactions={transactions} />
      ) : null}
    </div>
  );
};

