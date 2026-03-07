"use client";

import { Suspense, useMemo, useState } from "react";
import { TopicMonitorPanel } from "@/components/layout/topic-monitor-panel";
import { JournalCloud } from "@/components/papers/journal-cloud";
import { PaperFeed } from "@/components/papers/paper-feed";
import { FilterBar } from "@/components/papers/filter-bar";
import { usePapers } from "@/hooks/use-papers";
import { JOURNALS } from "@/lib/constants/journals";
import { PaperCardSkeleton } from "@/components/ui/skeleton";
import type { PaperFilters } from "@/types/filters";

function TopicsPage() {
  const [query, setQuery] = useState<string | undefined>();
  const [journals, setJournals] = useState<string[]>([]);
  const [journalCloudOpen, setJournalCloudOpen] = useState(true);

  const filters: PaperFilters = useMemo(
    () => ({
      q: query,
      journals: journals.length > 0 ? journals : undefined,
      sort: "date_desc" as const,
    }),
    [query, journals]
  );

  const { papers, total, hasMore, isLoading, isLoadingMore, loadMore } = usePapers(filters);

  const paperCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of papers) {
      counts[p.journal_slug] = (counts[p.journal_slug] || 0) + 1;
    }
    return counts;
  }, [papers]);

  const toggleJournal = (slug: string) => {
    setJournals((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const hasActiveFilters = Boolean(query || journals.length > 0);

  const handleRemoveFilter = (key: string, value?: string) => {
    if (key === "journals" && value) {
      setJournals((prev) => prev.filter((s) => s !== value));
    } else if (key === "q") {
      setQuery(undefined);
    }
  };

  const clearFilters = () => {
    setQuery(undefined);
    setJournals([]);
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-4 lg:pb-4">
      <h1 className="mb-4 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Topics & Journals
      </h1>

      <TopicMonitorPanel
        activeQuery={query}
        onActivate={(topic) => setQuery(topic)}
        onClearActive={() => setQuery(undefined)}
      />

      <section className="mt-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-2 flex items-center justify-between">
          <button
            onClick={() => setJournalCloudOpen((v) => !v)}
            className="flex items-center gap-1 text-sm font-semibold text-gray-900 dark:text-gray-100"
          >
            <svg
              className={`h-3.5 w-3.5 transition-transform ${journalCloudOpen ? "rotate-90" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            Journals{journals.length ? ` (${journals.length})` : ""}
          </button>
          {journals.length > 0 && (
            <button
              onClick={() => setJournals([])}
              className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:border-gray-400 dark:border-gray-700 dark:text-gray-300"
            >
              Clear journals
            </button>
          )}
        </div>
        {journalCloudOpen && (
          <JournalCloud
            journals={JOURNALS}
            activeJournals={journals}
            onToggle={toggleJournal}
            paperCounts={paperCounts}
          />
        )}
      </section>

      {hasActiveFilters && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
          <FilterBar
            filters={filters}
            onRemoveFilter={handleRemoveFilter}
            onClear={clearFilters}
          />
        </div>
      )}

      <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <PaperFeed
          papers={papers}
          total={total}
          hasMore={hasMore ?? false}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore ?? false}
          onLoadMore={loadMore}
        />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-3xl px-4 pt-4">
          <div className="space-y-4">
            <div className="h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-64 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      }
    >
      <TopicsPage />
    </Suspense>
  );
}
