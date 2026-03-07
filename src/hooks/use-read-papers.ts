"use client";

import useSWR from "swr";
import { useAuth } from "@/contexts/auth-context";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Unauthorized");
    return res.json();
  });

export function useReadPapers() {
  const { user } = useAuth();

  const { data, mutate, isLoading } = useSWR(
    user ? "/api/user/read-papers" : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const readIds = new Set<string>(
    (data?.readPapers ?? []).map((r: { paper_id: string }) => r.paper_id)
  );

  const markAsRead = async (paperId: string) => {
    if (!user || readIds.has(paperId)) return;

    // Optimistic
    mutate(
      {
        readPapers: [
          ...(data?.readPapers ?? []),
          { paper_id: paperId, read_at: new Date().toISOString() },
        ],
      },
      false
    );

    try {
      await fetch("/api/user/read-papers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paper_id: paperId }),
      });
      mutate();
    } catch {
      mutate();
    }
  };

  return { readIds, markAsRead, isLoading };
}
