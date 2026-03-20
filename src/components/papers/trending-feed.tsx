"use client";

import { TrendingUp } from "lucide-react";
import { useTrending } from "@/hooks/use-trending";
import { useAuth } from "@/contexts/auth-context";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useReadPapers } from "@/hooks/use-read-papers";
import { PaperCard } from "@/components/papers/paper-card";
import { PaperCardSkeleton } from "@/components/ui/skeleton";
import { TrendingTopicsPanel } from "@/components/papers/trending-topics-panel";

export function TrendingFeed() {
  const { papers, isLoading, error } = useTrending();
  const { user } = useAuth();
  const { bookmarkedIds, toggleBookmark } = useBookmarks();
  const { readIds, markAsRead } = useReadPapers();

  return (
    <div className="mx-auto w-full max-w-3xl px-0 sm:px-4 sm:py-4">
      <div className="mx-auto border-x border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        {/* Header */}
        <div className="sticky top-14 z-20 border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-gray-800 dark:bg-gray-950/90">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Trending
              </h1>
            </div>
            {papers.length > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">Last 7 days</span>
            )}
          </div>
        </div>

        {/* Trending Topics Panel */}
        <TrendingTopicsPanel
          onTopicClick={(query) => {
            window.location.href = `/?q=${encodeURIComponent(query)}`;
          }}
        />

        {/* Trending Papers */}
        <div className="border-t border-gray-200 dark:border-gray-800">
          <div className="px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Most Cited This Week
            </h2>
          </div>

          {isLoading ? (
            <div>
              {Array.from({ length: 5 }).map((_, i) => (
                <PaperCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <p className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Failed to load trending papers.
            </p>
          ) : papers.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              No trending papers yet.
            </p>
          ) : (
            <div>
              {papers.map((paper, idx) => (
                <div key={paper.id} className="relative">
                  <div className="absolute left-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                    {idx + 1}
                  </div>
                  <PaperCard
                    paper={paper}
                    isBookmarked={bookmarkedIds.has(paper.id)}
                    isRead={readIds.has(paper.id)}
                    onToggleBookmark={() => toggleBookmark(paper.id)}
                    onMarkAsRead={() => markAsRead(paper.id)}
                    isLoggedIn={!!user}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
