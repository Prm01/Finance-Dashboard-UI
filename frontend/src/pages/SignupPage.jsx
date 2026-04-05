import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Wallet, ShieldCheck, User, UserPlus } from "lucide-react";
import { useAppContext } from "../hooks/useTransactions.js";

const Field = ({ label, children, hint, error }) => (
  <label className="block">
    <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">
      {label}
    </div>
    <div className="mt-2">{children}</div>
    {error ? (
      <div className="mt-1 text-xs text-rose-600">{error}</div>
    ) : hint ? (
      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{hint}</div>
    ) : null}
  </label>
);

export const SignupPage = () => {
  const { state, signup, pushToast } = useAppContext();
  const navigate = useNavigate();

  const [form, setForm] = React.useState({
    username: "",
    password: "",
    role: "viewer",
  });
  const [errors, setErrors] = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (state.isAuthenticated) navigate("/", { replace: true });
  }, [state.isAuthenticated, navigate]);

  const validate = () => {
    const e = {};
    const u = String(form.username || "").trim().toLowerCase();
    const p = String(form.password || "");
    if (!u) e.username = "Username is required.";
    if (u && !/^[a-z0-9_]{3,20}$/.test(u)) {
      e.username = "Use 3–20 chars: a-z, 0-9, underscore.";
    }
    if (!p) e.password = "Password is required.";
    if (p && p.length < 6) e.password = "Password must be at least 6 characters.";
    if (!form.role) e.role = "Role is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await signup(form.username, form.password, form.role);
      pushToast({ type: "success", title: "Account created", message: "You can now sign in." });
      navigate("/login", { replace: true });
    } catch (err) {
      pushToast({ type: "error", title: "Sign up failed", message: err?.message || "Unable to create account." });
    } finally {
      setSubmitting(false);
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
                  Create account
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Register as Admin or Viewer
                </div>
              </div>
            </div>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <Field label="Username" hint="Lowercase recommended (e.g. pramo_01)" error={errors.username}>
                <input
                  value={form.username}
                  onChange={(ev) => setForm((p) => ({ ...p, username: ev.target.value }))}
                  placeholder="e.g. viewer01"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
              </Field>

              <Field label="Password" hint="Minimum 6 characters" error={errors.password}>
                <input
                  type="password"
                  value={form.password}
                  onChange={(ev) => setForm((p) => ({ ...p, password: ev.target.value }))}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
              </Field>

              <Field label="Role" error={errors.role}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, role: "admin" }))}
                    className={[
                      "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200",
                      form.role === "admin"
                        ? "border-purple-300 bg-purple-50 text-purple-900 dark:border-purple-900/60 dark:bg-purple-900/20 dark:text-purple-100"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",
                    ].join(" ")}
                  >
                    <ShieldCheck size={18} />
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, role: "viewer" }))}
                    className={[
                      "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200",
                      form.role === "viewer"
                        ? "border-blue-300 bg-blue-50 text-blue-900 dark:border-blue-900/60 dark:bg-blue-900/20 dark:text-blue-100"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",
                    ].join(" ")}
                  >
                    <User size={18} />
                    Viewer
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Admin can add/edit/delete transactions. Viewer is read-only.
                </div>
                <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                  You’re registering as{" "}
                  <span className="font-semibold">
                    {form.role === "admin" ? "Admin" : "Viewer"}
                  </span>
                  .
                </div>
              </Field>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700 disabled:opacity-60"
              >
                {submitting ? "Creating..." : (
                  <span className="inline-flex items-center gap-2">
                    <UserPlus size={18} />
                    Sign up
                  </span>
                )}
              </button>
            </form>

            <div className="mt-5 text-center text-sm text-gray-600 dark:text-gray-300">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-indigo-700 hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-200"
              >
                Sign in
              </Link>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
            This demo signup is frontend-only (stored in your browser).
          </div>
        </div>
      </div>
    </div>
  );
};

