import type { Metadata } from "next";
import { TrendingFeed } from "@/components/papers/trending-feed";

export const metadata: Metadata = {
  title: "Trending | My GI",
};

export default function TrendingPage() {
  return <TrendingFeed />;
}
