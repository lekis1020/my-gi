"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Bookmark } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useReadPapers } from "@/hooks/use-read-papers";
import { PaperCard } from "@/components/papers/paper-card";
import { PaperCardSkeleton } from "@/components/ui/skeleton";
import type { PaperWithJournal } from "@/types/filters";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BookmarksPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { bookmarkedIds, toggleBookmark } = useBookmarks();
  const { readIds, markAsRead } = useReadPapers();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // Fetch bookmarked paper details
  const paperIds = Array.from(bookmarkedIds);
  const { data, isLoading: papersLoading } = useSWR<{ papers: PaperWithJournal[] }>(
    paperIds.length > 0
      ? `/api/papers?ids=${paperIds.join(",")}`
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  if (authLoading || !user) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <PaperCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const papers = data?.papers ?? [];

  return (
    <div className="mx-auto w-full max-w-3xl border-x border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="sticky top-14 z-20 border-b border-gray-200 bg-white/95 px-4 py-4 backdrop-blur dark:border-gray-800 dark:bg-gray-950/90">
        <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          <Bookmark className="h-5 w-5 text-blue-600" />
          Saved Papers
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {paperIds.length} papers saved
        </p>
      </div>

      {papersLoading ? (
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {Array.from({ length: 3 }).map((_, i) => (
            <PaperCardSkeleton key={i} />
          ))}
        </div>
      ) : papers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Bookmark className="mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
            No saved papers yet
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Click the bookmark icon on any paper to save it here
          </p>
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
  );
}
