"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Microscope, Pill, Stethoscope, ChevronRight } from "lucide-react";
import { useClinicalTrials } from "@/hooks/use-clinical-trials";

interface ClinicalTrialSummaryProps {
  onItemClick?: (query: string) => void;
}

export function ClinicalTrialSummary({ onItemClick }: ClinicalTrialSummaryProps) {
  const { studies, isLoading } = useClinicalTrials();

  const highlights = useMemo(() => {
    if (!studies.length) return [];

    const interventionCounts = new Map<string, number>();
    const conditionCounts = new Map<string, number>();

    for (const study of studies) {
      for (const intervention of study.interventions) {
        if (intervention.length < 3) continue;
        interventionCounts.set(
          intervention,
          (interventionCounts.get(intervention) ?? 0) + 1,
        );
      }
      for (const condition of study.conditions) {
        if (condition.length < 3) continue;
        conditionCounts.set(
          condition,
          (conditionCounts.get(condition) ?? 0) + 1,
        );
      }
    }

    const topInterventions = [...interventionCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count, type: "intervention" as const }));

    const usedNames = new Set(topInterventions.map((i) => i.name));

    const topConditions = [...conditionCounts.entries()]
      .filter(([name]) => !usedNames.has(name))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8 - topInterventions.length)
      .map(([name, count]) => ({ name, count, type: "condition" as const }));

    return [...topInterventions, ...topConditions];
  }, [studies]);

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-3 h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      </section>
    );
  }

  if (!studies.length) return null;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
        <Microscope className="h-4 w-4 text-emerald-500" />
        Trial Highlights
      </h3>

      <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
        {studies.length} ongoing studies tracked
      </p>

      <div className="space-y-1">
        {highlights.map((item, idx) => (
          <button
            key={item.name}
            onClick={() => onItemClick?.(item.name)}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              {idx + 1}
            </span>
            {item.type === "intervention" ? (
              <Pill className="h-3.5 w-3.5 shrink-0 text-teal-500" />
            ) : (
              <Stethoscope className="h-3.5 w-3.5 shrink-0 text-blue-500" />
            )}
            <span className="min-w-0 flex-1 truncate text-gray-700 dark:text-gray-300">
              {item.name}
            </span>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-400" />
          </button>
        ))}
      </div>

      <Link
        href="/clinical-trials"
        className="mt-3 flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
      >
        View all clinical trials
        <ChevronRight className="h-3 w-3" />
      </Link>
    </section>
  );
}
