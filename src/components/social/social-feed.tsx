"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { ExternalLink } from "lucide-react";

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement | null) => void;
      };
    };
  }
}

interface JournalAccount {
  journal: string;
  abbr: string;
  handle: string;
  color: string;
}

const accounts: JournalAccount[] = [
  { journal: "Gastroenterology", abbr: "Gastro", handle: "AGA_Gastro", color: "#DC2626" },
  { journal: "Gut", abbr: "Gut", handle: "Gut_BMJ", color: "#1E3A8A" },
  { journal: "Lancet GI & Hepatol", abbr: "Lancet GH", handle: "LancetGastroHep", color: "#9F1239" },
  { journal: "Nat Rev GI & Hepatol", abbr: "Nat Rev", handle: "NatRevGastroHep", color: "#991B1B" },
  { journal: "J Hepatology", abbr: "J Hepatol", handle: "JHepatology", color: "#134E4A" },
  { journal: "Hepatology", abbr: "Hepatology", handle: "HEP_Journal", color: "#065F46" },
  { journal: "Am J Gastroenterol", abbr: "AJG", handle: "AmJGastro", color: "#B91C1C" },
  { journal: "Clin Gastro Hepatol", abbr: "CGH", handle: "AGA_CGH", color: "#1D4ED8" },
  { journal: "UEG Journal", abbr: "UEGJ", handle: "UEGJournal", color: "#C2410C" },
];

export function SocialFeed() {
  const [selected, setSelected] = useState(accounts[0]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [widgetReady, setWidgetReady] = useState(false);

  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(mq.matches ? "dark" : "light");
    const handler = (e: MediaQueryListEvent) =>
      setTheme(e.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const reloadWidget = useCallback(() => {
    if (containerRef.current && window.twttr?.widgets) {
      window.twttr.widgets.load(containerRef.current);
    }
  }, []);

  // Handle case where script is already loaded (e.g., tab switch re-mount)
  useEffect(() => {
    if (window.twttr?.widgets) {
      setWidgetReady(true);
      reloadWidget();
    }
  }, [reloadWidget]);

  // Reload widget when selected account or theme changes
  useEffect(() => {
    if (widgetReady) {
      const timer = setTimeout(reloadWidget, 50);
      return () => clearTimeout(timer);
    }
  }, [selected, theme, widgetReady, reloadWidget]);

  return (
    <aside className="space-y-3">
      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
        onReady={() => {
          setWidgetReady(true);
          reloadWidget();
        }}
      />

      {/* Account selector pills */}
      <div className="flex flex-wrap gap-1.5">
        {accounts.map((account) => (
          <button
            key={account.handle}
            onClick={() => setSelected(account)}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
              selected.handle === account.handle
                ? "text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            }`}
            style={
              selected.handle === account.handle
                ? { backgroundColor: account.color }
                : undefined
            }
          >
            {account.abbr}
          </button>
        ))}
      </div>

      {/* Twitter timeline embed */}
      <div
        ref={containerRef}
        key={`${selected.handle}-${theme}`}
        className="min-h-[400px] overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      >
        <a
          className="twitter-timeline"
          data-height="600"
          data-theme={theme}
          data-chrome="noheader nofooter noborders transparent"
          href={`https://x.com/${selected.handle}`}
        >
          <span className="flex h-[400px] items-center justify-center" style={{ display: "flex" }}>
            <span className="text-center">
              <span className="mb-3 block text-sm text-gray-400 dark:text-gray-500">
                Loading @{selected.handle}...
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-blue-500">
                Open on X <ExternalLink className="h-3 w-3" />
              </span>
            </span>
          </span>
        </a>
      </div>

      {/* Account info footer */}
      <p className="text-center text-xs text-gray-400 dark:text-gray-500">
        <a
          href={`https://x.com/${selected.handle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600 hover:underline dark:hover:text-gray-300"
        >
          @{selected.handle}
        </a>
        {" · "}
        {selected.journal}
      </p>
    </aside>
  );
}
