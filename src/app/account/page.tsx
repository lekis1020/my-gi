"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, LogOut, Bookmark, BookOpen, Layers } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { createClient } from "@/lib/supabase/client";

interface Stats {
  bookmarks: number;
  readPapers: number;
  topics: number;
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-900">
      <Icon className="mb-1 h-5 w-5 text-gray-400" />
      <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {value}
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
    </div>
  );
}

export default function AccountPage() {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ bookmarks: 0, readPapers: 0, topics: 0 });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();

    async function fetchStats() {
      const [bookmarksRes, readRes, topicsRes] = await Promise.all([
        supabase
          .from("user_bookmarks")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user!.id),
        supabase
          .from("user_read_papers")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user!.id),
        supabase
          .from("user_topics")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user!.id),
      ]);

      setStats({
        bookmarks: bookmarksRes.count ?? 0,
        readPapers: readRes.count ?? 0,
        topics: topicsRes.count ?? 0,
      });
    }

    fetchStats();
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-teal-600" />
      </div>
    );
  }

  const displayName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const avatarUrl = user.user_metadata?.avatar_url;
  const provider = user.app_metadata?.provider ?? "email";

  return (
    <div className="mx-auto w-full max-w-md px-4 py-8">
      {/* Profile */}
      <div className="mb-6 flex flex-col items-center">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            className="mb-3 h-20 w-20 rounded-full"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-300">
            <User className="h-10 w-10" />
          </div>
        )}
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {displayName}
        </h1>
        <p className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
          <Mail className="h-3.5 w-3.5" />
          {user.email}
        </p>
        <span className="mt-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium capitalize text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          {provider === "google" ? "Google account" : "Email account"}
        </span>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-3 gap-3">
        <StatCard icon={Bookmark} label="Saved" value={stats.bookmarks} />
        <StatCard icon={BookOpen} label="Read" value={stats.readPapers} />
        <StatCard icon={Layers} label="Topics" value={stats.topics} />
      </div>

      {/* Actions */}
      <button
        onClick={async () => {
          await signOut();
          router.push("/");
        }}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
      >
        <LogOut className="h-4 w-4" />
        Log out
      </button>
    </div>
  );
}
