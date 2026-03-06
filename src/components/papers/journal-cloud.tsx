"use client";

import { useMemo } from "react";
import type { JournalConfig } from "@/lib/constants/journals";

interface JournalCloudProps {
  journals: JournalConfig[];
  activeJournals: string[];
  onToggle: (slug: string) => void;
  paperCounts: Record<string, number>;
}

function computeWeightedScores(
  journals: JournalConfig[],
  paperCounts: Record<string, number>
) {
  const ifs = journals.map((j) => j.impactFactor ?? 0);
  const counts = journals.map((j) => paperCounts[j.slug] ?? 0);

  const maxIF = Math.max(...ifs, 1);
  const minIF = Math.min(...ifs);
  const maxCount = Math.max(...counts, 1);
  const minCount = Math.min(...counts);

  const rangeIF = maxIF - minIF || 1;
  const rangeCount = maxCount - minCount || 1;

  return journals.map((j) => {
    const normIF = ((j.impactFactor ?? 0) - minIF) / rangeIF;
    const normCount = ((paperCounts[j.slug] ?? 0) - minCount) / rangeCount;
    return normIF * 0.5 + normCount * 0.5;
  });
}

const MIN_SIZE = 12;
const MAX_SIZE = 28;

export function JournalCloud({
  journals,
  activeJournals,
  onToggle,
  paperCounts,
}: JournalCloudProps) {
  const sizes = useMemo(() => {
    const scores = computeWeightedScores(journals, paperCounts);
    return scores.map((s) => Math.round(MIN_SIZE + s * (MAX_SIZE - MIN_SIZE)));
  }, [journals, paperCounts]);

  const hasFilter = activeJournals.length > 0;

  return (
    <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
      {journals.map((journal, i) => {
        const active = activeJournals.includes(journal.slug);
        const count = paperCounts[journal.slug] ?? 0;

        return (
          <button
            key={journal.slug}
            onClick={() => onToggle(journal.slug)}
            title={`${journal.name} — IF ${journal.impactFactor ?? "N/A"} · ${count} papers`}
            className="cursor-pointer rounded-md px-1 py-0.5 transition-all duration-150 hover:opacity-80"
            style={{
              fontSize: `${sizes[i]}px`,
              lineHeight: 1.3,
              color: active || !hasFilter ? journal.color : undefined,
              opacity: hasFilter && !active ? 0.3 : 1,
              fontWeight: active ? 700 : 400,
            }}
          >
            {journal.abbreviation}
          </button>
        );
      })}
    </div>
  );
}
