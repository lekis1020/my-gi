"use client";

import { useMemo } from "react";
import { useTrending } from "@/hooks/use-trending";
import { TRENDING_CATEGORIES, type TrendingCategory } from "@/lib/constants/trending-categories";

export interface TrendingTopicItem {
  keyword: string;
  count: number;
}

export function useTrendingTopics(categoryId: string) {
  const { papers, isLoading, error } = useTrending();

  const category = TRENDING_CATEGORIES.find((c) => c.id === categoryId) ?? TRENDING_CATEGORIES[0];

  const topics = useMemo(() => {
    if (!papers.length || !category) return [];
    return extractTopics(papers, category);
  }, [papers, category]);

  return {
    topics,
    isLoading,
    error,
    category,
  };
}

function extractTopics(
  papers: Array<{
    title: string;
    abstract: string | null;
    keywords: string[];
    mesh_terms: string[];
  }>,
  category: TrendingCategory,
): TrendingTopicItem[] {
  const excludeSet = new Set(category.excludeTerms.map((t) => t.toLowerCase()));
  const wordCounts = new Map<string, number>();

  for (const paper of papers) {
    const text = [
      paper.title,
      paper.abstract ?? "",
      ...paper.keywords,
      ...paper.mesh_terms,
    ]
      .join(" ")
      .toLowerCase();

    // Check if paper belongs to this category
    const searchTerms = category.searchQuery
      .replace(/"/g, "")
      .split(/\s+OR\s+/i)
      .map((t) => t.trim().toLowerCase());

    const belongs = searchTerms.some((term) => text.includes(term));
    if (!belongs && category.id !== "others") continue;

    // Extract meaningful keywords/mesh terms
    const allTerms = [...paper.keywords, ...paper.mesh_terms];
    for (const term of allTerms) {
      const lower = term.toLowerCase().trim();
      if (lower.length < 3) continue;
      if (excludeSet.has(lower)) continue;

      wordCounts.set(lower, (wordCounts.get(lower) ?? 0) + 1);
    }
  }

  return [...wordCounts.entries()]
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([keyword, count]) => ({ keyword, count }));
}
