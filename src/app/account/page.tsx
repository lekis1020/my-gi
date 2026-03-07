"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, BookOpen, FolderTree, Stethoscope, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useReadPapers } from "@/hooks/use-read-papers";

export default function AccountPage() {
  const { user } = useAuth();
  const { bookmarkedIds } = useBookmarks();
  const { readIds } = useReadPapers();
  const [topicCount, setTopicCount] = useState(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("my-gi:topic-monitors");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setTopicCount(parsed.length);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const savedCount = bookmarkedIds.size;
  const readCount = readIds.size;

  const stats = [
    {
      href: "/saved",
      icon: Bookmark,
      iconBg: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300",
      label: "Saved Papers",
      description: `${savedCount} ${savedCount === 1 ? "paper" : "papers"} bookmarked`,
    },
    {
      href: "/saved?tab=read",
      icon: BookOpen,
      iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300",
      label: "Read Papers",
      description: `${readCount} ${readCount === 1 ? "paper" : "papers"} read`,
    },
    {
      href: "/topics",
      icon: FolderTree,
      iconBg: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300",
      label: "Custom Topics",
      description: `${topicCount} custom ${topicCount === 1 ? "topic" : "topics"} monitored`,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-4 lg:pb-4">
      <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-300">
          <Stethoscope className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">My Account</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user?.email ?? "Not signed in"}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {stats.map(({ href, icon: Icon, iconBg, label, description }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBg}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </Link>
        ))}
      </div>
    </div>
  );
}
