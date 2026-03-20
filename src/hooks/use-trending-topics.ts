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

/** Generic MeSH/keyword terms to exclude globally */
const GENERIC_TERMS = new Set([
  "humans", "male", "female", "middle aged", "aged",
  "adult", "young adult", "adolescent", "child", "infant",
  "animals", "mice", "rats", "treatment outcome",
  "retrospective studies", "prospective studies",
  "risk factors", "prognosis", "signal transduction",
  "disease models, animal",
]);

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
      if (GENERIC_TERMS.has(lower)) continue;

      wordCounts.set(lower, (wordCounts.get(lower) ?? 0) + 1);
    }
  }

  // Cluster similar keywords (e.g., "liver neoplasms" and "liver neoplasm")
  const clustered = clusterKeywords(wordCounts);

  return [...clustered.entries()]
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([keyword, count]) => ({ keyword, count }));
}

/**
 * Cluster keywords that are singular/plural variants or substrings of
 * each other (e.g., "neoplasm" / "neoplasms", "liver cirrhosis" / "cirrhosis").
 * Merges counts into the shorter canonical form.
 */
function clusterKeywords(counts: Map<string, number>): Map<string, number> {
  const entries = [...counts.entries()].sort((a, b) => a[0].length - b[0].length);
  const merged = new Map<string, number>();
  const aliasMap = new Map<string, string>(); // maps original → canonical

  for (const [term, count] of entries) {
    // Check if this term is a plural/variant of an already-seen canonical
    let canonical: string | null = null;

    for (const existing of merged.keys()) {
      if (isSameCluster(existing, term)) {
        canonical = existing;
        break;
      }
    }

    if (canonical) {
      merged.set(canonical, (merged.get(canonical) ?? 0) + count);
      aliasMap.set(term, canonical);
    } else {
      merged.set(term, count);
    }
  }

  return merged;
}

function isSameCluster(a: string, b: string): boolean {
  if (a === b) return true;

  // Singular/plural: "neoplasm" ↔ "neoplasms", "metastasis" ↔ "metastases"
  if (a + "s" === b || b + "s" === a) return true;
  if (a + "es" === b || b + "es" === a) return true;
  // "sis" → "ses" (e.g., cirrhosis/cirrhoses, metastasis/metastases)
  if (a.endsWith("sis") && b === a.slice(0, -2) + "es") return true;
  if (b.endsWith("sis") && a === b.slice(0, -2) + "es") return true;

  // MeSH comma-inverted form: "carcinoma, hepatocellular" ↔ "hepatocellular carcinoma"
  const commaA = a.split(", ");
  if (commaA.length === 2 && `${commaA[1]} ${commaA[0]}` === b) return true;
  const commaB = b.split(", ");
  if (commaB.length === 2 && `${commaB[1]} ${commaB[0]}` === a) return true;

  return false;
}
