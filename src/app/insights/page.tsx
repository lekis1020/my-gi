"use client";

import { Suspense, useState } from "react";
import useSWR from "swr";
import { BarChart3, MessageCircle } from "lucide-react";
import { RightRail } from "@/components/layout/right-rail";
import { SocialFeed } from "@/components/social/social-feed";
import { usePapers } from "@/hooks/use-papers";

const countFetcher = (url: string) => fetch(url).then((res) => res.json());

function InsightsPage() {
  const { papers } = usePapers({ sort: "date_desc", limit: 20 });
  const { data: countData } = useSWR(
    "/api/papers?limit=1",
    countFetcher,
    { revalidateOnFocus: false }
  );
  const total = countData?.total ?? 0;
  const [activeTab, setActiveTab] = useState<"analytics" | "social">("analytics");

  return (
    <div className="mx-auto w-full max-w-5xl px-2 pb-24 pt-4 sm:px-4 lg:pb-4">
      <h1 className="mb-1 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Insights
      </h1>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Analytics & journal social feeds
      </p>

      {/* Mobile tabs */}
      <div className="mb-4 flex gap-2 lg:hidden">
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            activeTab === "analytics"
              ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          <BarChart3 className="h-3.5 w-3.5" />
          Analytics
        </button>
        <button
          onClick={() => setActiveTab("social")}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            activeTab === "social"
              ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          <MessageCircle className="h-3.5 w-3.5" />
          Social
        </button>
      </div>

      {/* Dual column layout */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        {/* Left: Analytics */}
        <div className={activeTab === "analytics" ? "" : "hidden lg:block"}>
          <div className="mb-3 hidden items-center gap-2 text-sm font-semibold text-gray-700 lg:flex dark:text-gray-300">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </div>
          <RightRail total={total} papers={papers} />
        </div>

        {/* Right: Social */}
        <div className={activeTab === "social" ? "" : "hidden lg:block"}>
          <div className="mb-3 hidden items-center gap-2 text-sm font-semibold text-gray-700 lg:flex dark:text-gray-300">
            <MessageCircle className="h-4 w-4" />
            Journal Social
          </div>
          <SocialFeed />
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-5xl px-2 pt-4 sm:px-4">
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
