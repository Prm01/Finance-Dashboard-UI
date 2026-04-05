import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../hooks/useTransactions.js";
import { User, Camera } from "lucide-react";

export const ProfilePage = () => {
  const { state, updateUserProfile } = useAppContext();
  const user = state.user;
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDisplayName(user?.displayName || "");
    setAvatarPreview(user?.avatarUrl || null);
    setIsEditing(false);
  }, [user]);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile({
        displayName: displayName.trim() || user.username,
        avatarUrl: avatarPreview,
      });
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(user?.displayName || "");
    setAvatarPreview(user?.avatarUrl || null);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950/50">
      <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-200/70 bg-white dark:border-white/10 dark:bg-slate-950/90 shadow-sm shadow-slate-900/5 p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-black px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-yellow-300">
                <User size={14} /> Profile
              </p>
              <h1 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">Account profile</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                View your profile details here. Click edit to update display name or avatar.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Status</p>
              <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                {user ? "Signed in" : "Guest access"}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {user ? "Use edit mode to update your profile." : "Sign in to personalize your account."}
              </p>
            </div>
          </div>

          {user ? (
            <div className="mt-10 space-y-6">
              <div className="rounded-3xl border border-gray-200/70 bg-slate-50 p-6 dark:border-white/10 dark:bg-slate-900">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="relative">
                    <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-black text-yellow-300 text-4xl font-bold overflow-hidden shadow-inner shadow-slate-900/20">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
                      ) : (
                        (displayName || user.username || "U")[0]?.toUpperCase()
                      )}
                    </div>
                    {isEditing && (
                      <label className="absolute right-0 bottom-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-yellow-300 text-black shadow-lg shadow-yellow-300/30 transition hover:bg-yellow-400">
                        <Camera size={16} />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </label>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Profile picture</p>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      {isEditing ? "Upload a new avatar while editing." : "Click edit to change your avatar."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-gray-200/70 bg-white p-6 dark:border-white/10 dark:bg-slate-950">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Profile details</h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      Only update your profile when you want to change your display name or avatar.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditing((value) => !value)}
                    className="inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-yellow-300 transition hover:bg-slate-900"
                  >
                    {isEditing ? "Cancel edit" : "Edit profile"}
                  </button>
                </div>

                <div className="mt-6 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white">Display name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="mt-3 w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 dark:border-white/10 dark:bg-slate-900 dark:text-white"
                      />
                    ) : (
                      <div className="mt-3 rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
                        {displayName || user.username}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white">Username</label>
                    <div className="mt-3 rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
                      {user.username}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white">Role</label>
                    <div className="mt-3 rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
                      {user.role}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-yellow-300 transition hover:bg-slate-900 disabled:opacity-70"
                      >
                        {saving ? "Saving..." : "Save changes"}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
                      >
                        Discard
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-10 rounded-3xl border border-gray-200/70 bg-white p-6 dark:border-white/10 dark:bg-slate-950">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Sign in to edit your profile</h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                Once signed in, you can change your name and avatar from this page.
              </p>
              <Link
                to="/login"
                className="mt-6 inline-flex items-center rounded-2xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                Sign in now
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
