"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Bookmark, Clock } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useReadPapers } from "@/hooks/use-read-papers";
import { PaperCard } from "@/components/papers/paper-card";
import { PaperCardSkeleton } from "@/components/ui/skeleton";
import type { PaperWithJournal } from "@/types/filters";

type Tab = "bookmarked" | "read";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function SavedPage() {
  const [tab, setTab] = useState<Tab>("bookmarked");
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { bookmarkedIds, toggleBookmark } = useBookmarks();
  const { readIds, markAsRead } = useReadPapers();

  const bookmarkList = Array.from(bookmarkedIds);
  const readList = Array.from(readIds);

  const activeIds = tab === "bookmarked" ? bookmarkList : readList;

  const { data, isLoading: papersLoading } = useSWR<{ papers: PaperWithJournal[] }>(
    activeIds.length > 0 ? `/api/papers?ids=${activeIds.join(",")}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  if (authLoading) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <PaperCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-4 lg:pb-4">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Bookmark className="mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Sign in to save papers
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Bookmark papers and track your reading history
          </p>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  const papers = data?.papers ?? [];

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-4 lg:pb-4">
      <h1 className="mb-4 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Saved
      </h1>

      <div className="grid grid-cols-2 rounded-xl border border-gray-200 bg-white text-sm dark:border-gray-800 dark:bg-gray-900">
        <button
          onClick={() => setTab("bookmarked")}
          className={`flex items-center justify-center gap-1.5 rounded-l-xl border-b-2 py-3 font-medium transition-colors ${
            tab === "bookmarked"
              ? "border-blue-500 bg-blue-50/50 text-gray-900 dark:bg-blue-900/20 dark:text-gray-100"
              : "border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400"
          }`}
        >
          <Bookmark className="h-3.5 w-3.5" />
          Bookmarked ({bookmarkList.length})
        </button>
        <button
          onClick={() => setTab("read")}
          className={`flex items-center justify-center gap-1.5 rounded-r-xl border-b-2 py-3 font-medium transition-colors ${
            tab === "read"
              ? "border-blue-500 bg-blue-50/50 text-gray-900 dark:bg-blue-900/20 dark:text-gray-100"
              : "border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400"
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          Read ({readList.length})
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        {papersLoading ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {Array.from({ length: 3 }).map((_, i) => (
              <PaperCardSkeleton key={i} />
            ))}
          </div>
        ) : papers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            {tab === "bookmarked" ? (
              <>
                <Bookmark className="mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  No bookmarked papers yet
                </p>
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  Tap the bookmark icon on any paper to save it
                </p>
              </>
            ) : (
              <>
                <Clock className="mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  No read papers yet
                </p>
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  Papers you view will appear here
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {papers.map((paper) => (
              <PaperCard
                key={paper.id}
                paper={paper}
                isBookmarked={bookmarkedIds.has(paper.id)}
                isRead={readIds.has(paper.id)}
                onToggleBookmark={toggleBookmark}
                onMarkAsRead={markAsRead}
                isLoggedIn
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-3xl px-4 pt-4">
          <div className="h-8 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="mt-4 space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
            ))}
          </div>
        </div>
      }
    >
      <SavedPage />
    </Suspense>
  );
}
