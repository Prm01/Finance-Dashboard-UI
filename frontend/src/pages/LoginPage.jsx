import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Wallet, ShieldCheck, User } from "lucide-react";
import { useAppContext } from "../hooks/useTransactions.js";

const Field = ({ label, children, hint }) => (
  <label className="block">
    <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">
      {label}
    </div>
    <div className="mt-2">{children}</div>
    {hint ? (
      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{hint}</div>
    ) : null}
  </label>
);

export const LoginPage = () => {
  const { state, login, pushToast } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from && typeof location.state.from === "string" ? location.state.from : "/";

  const [form, setForm] = React.useState({ username: "", password: "" });
  const [submitting, setSubmitting] = React.useState(false);
  const [intent, setIntent] = React.useState(null); // "admin" | "viewer" | null

  React.useEffect(() => {
    if (state.isAuthenticated) navigate(from, { replace: true });
  }, [state.isAuthenticated, navigate, from]);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const u = String(form.username || "").trim().toLowerCase();
      const roleLabel = u === "admin" ? "Admin" : u === "viewer" ? "Viewer" : null;
      if (roleLabel) {
        pushToast({ type: "info", title: `Signing in as ${roleLabel}`, message: "Please wait..." });
      }
      await login(form.username, form.password);
      pushToast({ type: "success", title: "Welcome back", message: "Logged in successfully." });
      navigate(from, { replace: true });
    } catch (err) {
      pushToast({
        type: "error",
        title: "Login failed",
        message: err?.message || "Invalid credentials.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const chooseDemo = (role) => {
    if (submitting) return;
    if (role === "admin") {
      setForm({ username: "admin", password: "admin123" });
      setIntent("admin");
      pushToast({ type: "info", title: "Admin selected", message: "Now click “Sign in” to login as Admin." });
    } else {
      setForm({ username: "viewer", password: "viewer123" });
      setIntent("viewer");
      pushToast({ type: "info", title: "Viewer selected", message: "Now click “Sign in” to login as Viewer." });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft dark:border-gray-700 dark:bg-gray-800 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-soft">
                <Wallet size={20} />
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Welcome to Finance Dashboard
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Sign in to check your balances, spending, and insights.
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => chooseDemo("admin")}
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-800 transition-all duration-200 hover:bg-purple-100 disabled:opacity-60 dark:border-purple-900/40 dark:bg-purple-900/20 dark:text-purple-200 dark:hover:bg-purple-900/30"
              >
                <ShieldCheck size={18} />
                Admin access
              </button>
              <button
                type="button"
                onClick={() => chooseDemo("viewer")}
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-800 transition-all duration-200 hover:bg-blue-100 disabled:opacity-60 dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-blue-200 dark:hover:bg-blue-900/30"
              >
                <User size={18} />
                Viewer access
              </button>
            </div>

            {intent ? (
              <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                You’re signing in as <span className="font-semibold">
                  {intent === "admin" ? "Admin" : "Viewer"}
                </span>
                . Then just click <span className="font-semibold">Sign in</span>.
              </div>
            ) : null}

            <div className="mt-5 text-xs text-gray-500 dark:text-gray-400">
              Need a quick start? Try these credentials:
              <span className="ml-2 font-semibold text-gray-700 dark:text-gray-200">admin / admin123</span>
              <span className="mx-2">•</span>
              <span className="font-semibold text-gray-700 dark:text-gray-200">viewer / viewer123</span>
            </div>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <Field label="Username" hint="Enter your username">
                <input
                  value={form.username}
                  onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                  placeholder="e.g. admin"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
              </Field>

              <Field label="Password">
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
              </Field>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700 disabled:opacity-60"
              >
                {submitting ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>

          <div className="mt-3 text-center text-sm text-gray-600 dark:text-gray-300">
            New here?{" "}
            <Link
              to="/signup"
              className="font-semibold text-indigo-700 hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-200"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

