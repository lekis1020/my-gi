"use client";

import { Suspense } from "react";
import { RightRail } from "@/components/layout/right-rail";
import { usePapers } from "@/hooks/use-papers";

function InsightsPage() {
  const { papers, total } = usePapers({ sort: "date_desc", limit: 20 });

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-24 pt-4 lg:pb-4">
      <h1 className="mb-4 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Insights
      </h1>
      <RightRail total={total} papers={papers} />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-2xl px-4 pt-4">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-gray-200 dark:bg-gray-800" />
            ))}
          </div>
        </div>
      }
    >
      <InsightsPage />
    </Suspense>
  );
}
