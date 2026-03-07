"use client";

import { useState, useEffect } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

interface AiSummaryProps {
  pmid: string;
}

export function AiSummary({ pmid }: AiSummaryProps) {
  const { user } = useAuth();
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for cached summary on mount (only for logged-in users)
  useEffect(() => {
    if (!user) {
      setChecking(false);
      return;
    }
    fetch(`/api/papers/${pmid}/summary`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.summary) setSummary(data.summary);
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [pmid, user]);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/papers/${pmid}/summary`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "요약 생성에 실패했습니다");
      }
      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "요약 생성에 실패했습니다");
    } finally {
      setLoading(false);
    }
  }

  // Still checking for cached summary
  if (checking) return null;

  // Show summary if it exists
  if (summary) {
    return (
      <section className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50/50 p-5 dark:border-indigo-800 dark:bg-indigo-950/30">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          <Sparkles className="h-5 w-5 text-indigo-500" />
          AI 요약
        </h2>
        <div className="prose prose-sm max-w-none text-gray-700 dark:prose-invert dark:text-gray-300">
          {summary.split("\n").map((line, i) => {
            if (!line.trim()) return <br key={i} />;
            const parts = line.split(/(\*\*[^*]+\*\*)/g);
            return (
              <p key={i} className="my-1 leading-relaxed">
                {parts.map((part, j) =>
                  part.startsWith("**") && part.endsWith("**") ? (
                    <strong key={j} className="font-bold text-gray-900 dark:text-gray-100">
                      {part.slice(2, -2)}
                    </strong>
                  ) : (
                    <span key={j}>{part}</span>
                  )
                )}
              </p>
            );
          })}
        </div>
      </section>
    );
  }

  // No user = no generate button
  if (!user) return null;

  return (
    <section className="mt-4 rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-5 dark:border-gray-700 dark:bg-gray-900/30">
      <div className="flex flex-col items-center gap-3 text-center">
        <Sparkles className="h-8 w-8 text-indigo-400" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          AI가 이 논문의 초록을 한국어로 구조화하여 요약합니다
        </p>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              요약 생성 중...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              AI 요약 생성
            </>
          )}
        </button>
      </div>
    </section>
  );
}
