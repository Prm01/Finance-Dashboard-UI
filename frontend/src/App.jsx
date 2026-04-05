import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext.jsx";
import { MainLayout } from "./components/layout/MainLayout.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { TransactionsPage } from "./pages/TransactionsPage.jsx";
import { InsightsPage } from "./pages/InsightsPage.jsx";
import { FinancerPage } from "./pages/FinancerPage.jsx";
import { BudgetsPage } from "./pages/BudgetsPage.jsx";
import { ProfilePage } from "./pages/ProfilePage.jsx";
import { SettingsPage } from "./pages/SettingsPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { SignupPage } from "./pages/SignupPage.jsx";
import { Toast } from "./components/shared/Toast.jsx";
import { useAppContext } from "./hooks/useTransactions.js";

// Note: If you see "A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received"
// in the browser console, this is caused by browser extensions (ad blockers, privacy tools, etc.) and does not affect app functionality.
// The error originates from chrome-extension:// URLs, not this application code.

const ToastRenderer = () => {
  const { toasts, dismissToast } = useAppContext();
  // keep state in dependency chain to ensure rerender on toast changes
  return <Toast toasts={toasts} onDismiss={dismissToast} />;
};

export default function App() {
  return (
    <AppContextProvider>
      <BrowserRouter>
        <ToastRenderer />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/financer" element={<FinancerPage />} />
            <Route path="/budgets" element={<BudgetsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppContextProvider>
  );
}

