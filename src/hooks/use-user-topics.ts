"use client";

import useSWR from "swr";
import { useAuth } from "@/contexts/auth-context";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Unauthorized");
    return res.json();
  });

export function useUserTopics() {
  const { user } = useAuth();

  const { data, mutate, isLoading } = useSWR(
    user ? "/api/user/topics" : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const topics: string[] = data?.topics ?? [];

  const addTopic = async (topic: string) => {
    if (!user) return;
    const trimmed = topic.trim();
    if (!trimmed || topics.includes(trimmed)) return;

    mutate({ topics: [trimmed, ...topics] }, false);

    try {
      await fetch("/api/user/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: trimmed }),
      });
      mutate();
    } catch {
      mutate();
    }
  };

  const removeTopic = async (topic: string) => {
    if (!user) return;

    mutate({ topics: topics.filter((t) => t !== topic) }, false);

    try {
      await fetch(`/api/user/topics?topic=${encodeURIComponent(topic)}`, {
        method: "DELETE",
      });
      mutate();
    } catch {
      mutate();
    }
  };

  return { topics, addTopic, removeTopic, isLoading };
}
