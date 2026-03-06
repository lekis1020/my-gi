"use client";

import { useRef, useEffect, useCallback } from "react";
import { PaperCard } from "./paper-card";
import { PaperCardSkeleton } from "@/components/ui/skeleton";
import { AdUnit } from "@/components/ads/ad-unit";
import type { PaperWithJournal } from "@/types/filters";
import { Loader2 } from "lucide-react";

interface PaperFeedProps {
  papers: PaperWithJournal[];
  total: number;
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  bookmarkedIds?: Set<string>;
  readIds?: Set<string>;
  onToggleBookmark?: (paperId: string) => void;
  onMarkAsRead?: (paperId: string) => void;
  isLoggedIn?: boolean;
}

export function PaperFeed({
  papers,
  total,
  hasMore,
  isLoading,
  isLoadingMore,
  onLoadMore,
  bookmarkedIds,
  readIds,
  onToggleBookmark,
  onMarkAsRead,
  isLoggedIn = false,
}: PaperFeedProps) {
  const observerRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoadingMore) {
        onLoadMore();
      }
    },
    [hasMore, isLoadingMore, onLoadMore]
  );

  useEffect(() => {
    const element = observerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0,
      rootMargin: "200px",
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

  if (isLoading) {
    return (
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {Array.from({ length: 5 }).map((_, i) => (
          <PaperCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (papers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
          No papers found
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-gray-200 px-4 py-2 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
        {total.toLocaleString()} papers in your timeline
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {papers.map((paper, index) => (
          <div key={paper.id}>
            <PaperCard
              paper={paper}
              isBookmarked={bookmarkedIds?.has(paper.id)}
              isRead={readIds?.has(paper.id)}
              onToggleBookmark={onToggleBookmark}
              onMarkAsRead={onMarkAsRead}
              isLoggedIn={isLoggedIn}
            />
            {(index + 1) % 5 === 0 && (
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/50">
                <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-gray-400">Ad</p>
                <AdUnit slot="5895188725" format="fluid" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div ref={observerRef} className="flex justify-center py-8">
        {isLoadingMore && (
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        )}
        {!hasMore && papers.length > 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-500">
            All papers loaded
          </p>
        )}
      </div>
    </div>
  );
}
