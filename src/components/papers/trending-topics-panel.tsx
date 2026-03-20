"use client";

import { useState } from "react";
import { Flame, ChevronRight } from "lucide-react";
import { TRENDING_CATEGORIES } from "@/lib/constants/trending-categories";
import { useTrendingTopics } from "@/hooks/use-trending-topics";

interface TrendingTopicsPanelProps {
  onTopicClick?: (query: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  ibd: "border-red-500 text-red-700 dark:text-red-300",
  gerd_motility: "border-amber-500 text-amber-700 dark:text-amber-300",
  gi_oncology: "border-rose-500 text-rose-700 dark:text-rose-300",
  hepatology: "border-violet-500 text-violet-700 dark:text-violet-300",
  pancreatobiliary: "border-orange-500 text-orange-700 dark:text-orange-300",
  endoscopy: "border-blue-500 text-blue-700 dark:text-blue-300",
  functional_gi: "border-cyan-500 text-cyan-700 dark:text-cyan-300",
  gi_bleeding: "border-pink-500 text-pink-700 dark:text-pink-300",
  others: "border-gray-500 text-gray-700 dark:text-gray-300",
};

export function TrendingTopicsPanel({ onTopicClick }: TrendingTopicsPanelProps) {
  const [activeCategoryId, setActiveCategoryId] = useState(TRENDING_CATEGORIES[0].id);
  const { topics, isLoading } = useTrendingTopics(activeCategoryId);

  return (
    <div>
      {/* Category tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-gray-200 px-4 dark:border-gray-800">
        {TRENDING_CATEGORIES.map((cat) => {
          const isActive = activeCategoryId === cat.id;
          const colorClass = CATEGORY_COLORS[cat.id] ?? "border-gray-500 text-gray-700 dark:text-gray-300";
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`whitespace-nowrap border-b-2 px-3 py-2.5 text-xs font-semibold transition-colors ${
                isActive
                  ? colorClass
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Topics list */}
      <div className="p-4">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex animate-pulse items-center gap-3 rounded-lg p-2">
                <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 flex-1 rounded bg-gray-100 dark:bg-gray-800" />
                <div className="h-4 w-8 rounded bg-gray-100 dark:bg-gray-800" />
              </div>
            ))}
          </div>
        ) : topics.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            No trending topics found in this category yet.
          </p>
        ) : (
          <div className="space-y-1">
            {topics.map((topic, idx) => (
              <button
                key={topic.keyword}
                onClick={() => onTopicClick?.(topic.keyword)}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xs font-bold text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                  {idx + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                  {topic.keyword}
                </span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  {topic.count} papers
                </span>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              </button>
            ))}
          </div>
        )}

        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Based on papers from the last 7 days.
        </p>
      </div>
    </div>
  );
}
