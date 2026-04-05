import React, { useEffect, useState } from "react";
import { useAppContext } from "../hooks/useTransactions.js";
import { Settings, Bell, ShieldCheck, Camera } from "lucide-react";

export const SettingsPage = () => {
  const { state, updateUserProfile } = useAppContext();
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [assistantTips, setAssistantTips] = useState(true);
  const [compactLayout, setCompactLayout] = useState(false);
  const [displayName, setDisplayName] = useState(state.user?.displayName || "");
  const [avatarPreview, setAvatarPreview] = useState(state.user?.avatarUrl || null);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    setDisplayName(state.user?.displayName || "");
    setAvatarPreview(state.user?.avatarUrl || null);
  }, [state.user]);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!state.user) return;
    setSavingProfile(true);
    try {
      await updateUserProfile({
        displayName: displayName.trim() || state.user.username,
        avatarUrl: avatarPreview,
      });
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950/50">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-200/70 bg-white dark:border-white/10 dark:bg-slate-950/90 shadow-sm shadow-slate-900/5 p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                <Settings size={14} /> Settings
              </p>
              <h1 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">Preferences & profile</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                Configure your account settings and personalize your profile name and avatar.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Signed in as</p>
              <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{state.user?.displayName || state.user?.username || "Guest"}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{state.user ? state.user.role : "viewer"}</p>
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[320px_1fr]">
            <div className="rounded-3xl border border-gray-200/70 bg-slate-50 p-6 dark:border-white/10 dark:bg-slate-900">
              <div className="flex flex-col items-center gap-5 text-center">
                <div className="relative">
                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-slate-200 text-4xl font-bold text-slate-700 overflow-hidden dark:bg-slate-800 dark:text-slate-200">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
                    ) : (
                      (state.user?.displayName || state.user?.username || "U")[0]?.toUpperCase()
                    )}
                  </div>
                  <label className="absolute right-0 bottom-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-teal-600 text-white shadow-lg shadow-teal-500/20 transition hover:bg-teal-700">
                    <Camera size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Upload profile image</p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Supported formats: PNG, JPG, SVG.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6 rounded-3xl border border-gray-200/70 bg-white p-6 dark:border-white/10 dark:bg-slate-950">
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white">Display name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="mt-3 w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 dark:border-white/10 dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white">Username</label>
                <div className="mt-3 rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
                  {state.user?.username}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white">Role</label>
                <div className="mt-3 rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
                  {state.user?.role}
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Your name and avatar appear in the sidebar and the user dropdown.
                </p>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="inline-flex items-center justify-center rounded-2xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-70"
                >
                  {savingProfile ? "Saving..." : "Save profile"}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-10 space-y-6">
            {[
              {
                label: "Email updates",
                description: "Receive performance summaries and key alerts by email.",
                icon: Bell,
                enabled: emailUpdates,
                setEnabled: setEmailUpdates,
              },
              {
                label: "Assistant tips",
                description: "Show helpful finance insights from the assistant while browsing.",
                icon: ShieldCheck,
                enabled: assistantTips,
                setEnabled: setAssistantTips,
              },
              {
                label: "Compact layout",
                description: "Use tighter spacing for a denser view of your dashboard and lists.",
                icon: Settings,
                enabled: compactLayout,
                setEnabled: setCompactLayout,
              },
            ].map((option) => (
              <div key={option.label} className="rounded-3xl border border-gray-200/70 bg-slate-50 p-6 dark:border-white/10 dark:bg-slate-900">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    <option.icon size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-base font-semibold text-slate-900 dark:text-white">{option.label}</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{option.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => option.setEnabled((value) => !value)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${option.enabled ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"}`}
                      >
                        {option.enabled ? "On" : "Off"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
