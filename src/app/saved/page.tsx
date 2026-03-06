"use client";

import { Suspense } from "react";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Bookmark, Clock, Trash2 } from "lucide-react";
import { useSavedPapers, useReadPapers } from "@/hooks/use-paper-interactions";
import { formatRelativeDate } from "@/lib/utils/date";
import { decodeHtmlEntities } from "@/lib/utils/html-entities";

type Tab = "bookmarked" | "read";

function SavedPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "read" ? "read" : "bookmarked";
  const [tab, setTab] = useState<Tab>(initialTab);
  const { saved, toggleSave } = useSavedPapers();
  const { read } = useReadPapers();

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
          Bookmarked ({saved.length})
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
          Read ({read.length})
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {tab === "bookmarked" ? (
          saved.length === 0 ? (
            <EmptyState
              icon={<Bookmark className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600" />}
              title="No bookmarked papers yet"
              description="Tap the bookmark icon on any paper to save it"
            />
          ) : (
            saved.map((paper) => (
              <PaperListItem
                key={paper.pmid}
                pmid={paper.pmid}
                title={paper.title}
                journal_abbreviation={paper.journal_abbreviation}
                journal_color={paper.journal_color}
                publication_date={paper.publication_date}
                timestamp={paper.savedAt}
                timestampLabel="Saved"
                onRemove={() => toggleSave(paper)}
              />
            ))
          )
        ) : read.length === 0 ? (
          <EmptyState
            icon={<Clock className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600" />}
            title="No read papers yet"
            description="Papers you view will appear here"
          />
        ) : (
          read.map((paper) => (
            <PaperListItem
              key={paper.pmid}
              pmid={paper.pmid}
              title={paper.title}
              journal_abbreviation={paper.journal_abbreviation}
              journal_color={paper.journal_color}
              publication_date={paper.publication_date}
              timestamp={paper.readAt}
              timestampLabel="Read"
            />
          ))
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="py-16 text-center">
      {icon}
      <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{description}</p>
    </div>
  );
}

function PaperListItem({
  pmid,
  title,
  journal_abbreviation,
  journal_color,
  publication_date,
  timestamp,
  timestampLabel,
  onRemove,
}: {
  pmid: string;
  title: string;
  journal_abbreviation: string;
  journal_color: string;
  publication_date: string;
  timestamp: number;
  timestampLabel: string;
  onRemove?: () => void;
}) {
  const avatarLabel = journal_abbreviation
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
      <div
        className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
        style={{
          backgroundColor: `${journal_color}20`,
          color: journal_color,
          border: `1px solid ${journal_color}33`,
        }}
      >
        {avatarLabel}
      </div>
      <div className="min-w-0 flex-1">
        <Link
          href={`/paper/${pmid}`}
          className="line-clamp-2 text-sm font-medium text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400"
        >
          {decodeHtmlEntities(title)}
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-gray-500 dark:text-gray-400">
          <span>{journal_abbreviation}</span>
          <span className="text-gray-300 dark:text-gray-600">&middot;</span>
          <span>{formatRelativeDate(publication_date)}</span>
          <span className="text-gray-300 dark:text-gray-600">&middot;</span>
          <span>
            {timestampLabel} {new Date(timestamp).toLocaleDateString()}
          </span>
        </div>
      </div>
      {onRemove && (
        <button
          onClick={onRemove}
          className="mt-1 rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-800"
          aria-label="Remove"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
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
