"use client";

import useSWR from "swr";
import { useAuth } from "@/contexts/auth-context";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Unauthorized");
    return res.json();
  });

export function useBookmarks() {
  const { user } = useAuth();

  const { data, mutate, isLoading } = useSWR(
    user ? "/api/user/bookmarks" : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const bookmarkedIds = new Set<string>(
    (data?.bookmarks ?? []).map((b: { paper_id: string }) => b.paper_id)
  );

  const toggleBookmark = async (paperId: string) => {
    if (!user) return;

    const isBookmarked = bookmarkedIds.has(paperId);

    // Optimistic update
    const optimistic = isBookmarked
      ? { bookmarks: data.bookmarks.filter((b: { paper_id: string }) => b.paper_id !== paperId) }
      : { bookmarks: [...(data?.bookmarks ?? []), { paper_id: paperId, created_at: new Date().toISOString() }] };

    mutate(optimistic, false);

    try {
      if (isBookmarked) {
        await fetch(`/api/user/bookmarks?paper_id=${paperId}`, { method: "DELETE" });
      } else {
        await fetch("/api/user/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paper_id: paperId }),
        });
      }
      mutate();
    } catch {
      mutate(); // Revert on error
    }
  };

  return { bookmarkedIds, toggleBookmark, isLoading };
}
