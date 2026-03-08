"use client";

import { useState } from "react";
import { MapPin, ExternalLink, Circle, Globe, Flag } from "lucide-react";

interface Conference {
  name: string;
  fullName: string;
  date: string;
  location: string;
  url: string;
  color: string;
  verified: string;
}

// All dates verified from official conference websites on 2026-03-08 using Scrapling
const international: Conference[] = [
  {
    name: "ECCO",
    fullName: "European Crohn's and Colitis Organisation Congress",
    date: "2026-02-18/2026-02-21",
    location: "Stockholm, Sweden",
    url: "https://ecco-ibd.eu",
    color: "#a855f7",
    verified: "2026-03-08",
  },
  {
    name: "DDW",
    fullName: "Digestive Disease Week",
    date: "2026-05-02/2026-05-05",
    location: "Chicago, IL, USA",
    url: "https://ddw.org",
    color: "#3b82f6",
    verified: "2026-03-08",
  },
  {
    name: "ESGE Days",
    fullName: "European Society of Gastrointestinal Endoscopy",
    date: "2026-05-14/2026-05-16",
    location: "Milan, Italy",
    url: "https://esgedays.org",
    color: "#10b981",
    verified: "2026-03-08",
  },
  {
    name: "ACG",
    fullName: "American College of Gastroenterology Annual Meeting",
    date: "2026-10-09/2026-10-14",
    location: "Nashville, TN, USA",
    url: "https://acgmeetings.gi.org",
    color: "#f59e0b",
    verified: "2026-03-08",
  },
  {
    name: "UEGW",
    fullName: "United European Gastroenterology Week",
    date: "2026-10-17/2026-10-20",
    location: "Barcelona, Spain",
    url: "https://ueg.eu/week",
    color: "#6366f1",
    verified: "2026-03-08",
  },
  {
    name: "AASLD",
    fullName: "The Liver Meeting",
    date: "2026-11-05/2026-11-09",
    location: "Washington, D.C., USA",
    url: "https://www.aasld.org/the-liver-meeting",
    color: "#14b8a6",
    verified: "2026-03-08",
  },
  {
    name: "JDDW",
    fullName: "Japan Digestive Disease Week",
    date: "2026-11-05/2026-11-07",
    location: "Kobe, Japan",
    url: "https://www.jddw.jp/jddw2026/en/index.html",
    color: "#ef4444",
    verified: "2026-03-08",
  },
];

const domestic: Conference[] = [
  {
    name: "KASL STC",
    fullName: "대한간학회 Single Topic Symposium",
    date: "2026-03-14/2026-03-14",
    location: "전북대학교병원",
    url: "https://www.kasl.org",
    color: "#8b5cf6",
    verified: "2026-03-08",
  },
  {
    name: "KSGE 세미나",
    fullName: "대한소화기내시경학회 제73회 세미나",
    date: "2026-03-15/2026-03-15",
    location: "일산 KINTEX",
    url: "https://www.gie.or.kr",
    color: "#f97316",
    verified: "2026-03-08",
  },
  {
    name: "HUG 2026",
    fullName: "대한상부위장관·헬리코박터학회 국제학술대회",
    date: "2026-03-19/2026-03-21",
    location: "Lotte Hotel Seoul",
    url: "https://www.hpylori.or.kr",
    color: "#ec4899",
    verified: "2026-03-08",
  },
  {
    name: "SIDDS 2026",
    fullName: "대한소화기학회 국제심포지엄",
    date: "2026-04-18/2026-04-19",
    location: "Grand Walkerhill Seoul",
    url: "https://www.sidds.org",
    color: "#0ea5e9",
    verified: "2026-03-08",
  },
  {
    name: "AOCC 2026",
    fullName: "대한장연구학회 (KASID) 국제학술대회",
    date: "2026-06-25/2026-06-27",
    location: "COEX, Seoul",
    url: "https://www.aocc2026.org",
    color: "#22c55e",
    verified: "2026-03-08",
  },
];

function parseDate(dateStr: string) {
  const [start, end] = dateStr.split("/");
  return {
    start: new Date(start + "T00:00:00"),
    end: new Date(end + "T23:59:59"),
  };
}

function getStatus(dateStr: string): "past" | "ongoing" | "upcoming" {
  const now = new Date();
  const { start, end } = parseDate(dateStr);
  if (now > end) return "past";
  if (now >= start && now <= end) return "ongoing";
  return "upcoming";
}

function formatShortDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function daysUntil(dateStr: string) {
  const { start } = parseDate(dateStr);
  const now = new Date();
  return Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getMonthLabel(dateStr: string) {
  const { start } = parseDate(dateStr);
  return start.toLocaleDateString("en-US", { month: "long" });
}

function Timeline({ conferences }: { conferences: Conference[] }) {
  const currentYear = new Date().getFullYear();
  const filtered = conferences
    .filter((c) => parseDate(c.date).start.getFullYear() >= currentYear)
    .sort(
      (a, b) =>
        parseDate(a.date).start.getTime() - parseDate(b.date).start.getTime()
    );

  let lastMonth = "";

  return (
    <div className="relative">
      <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
      <div className="space-y-0">
        {filtered.map((conf) => {
          const status = getStatus(conf.date);
          const days = daysUntil(conf.date);
          const { start, end } = parseDate(conf.date);
          const month = getMonthLabel(conf.date);
          const showMonth = month !== lastMonth;
          lastMonth = month;
          const isSingleDay = conf.date.split("/")[0] === conf.date.split("/")[1];

          return (
            <div key={conf.name}>
              {showMonth && (
                <div className="relative flex items-center pb-3 pt-1">
                  <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                      {start
                        .toLocaleDateString("en-US", { month: "short" })
                        .toUpperCase()}
                    </span>
                  </div>
                </div>
              )}

              <a
                href={conf.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex gap-4 pb-6"
              >
                <div className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center">
                  {status === "ongoing" ? (
                    <span className="relative flex h-4 w-4">
                      <span
                        className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                        style={{ backgroundColor: conf.color }}
                      />
                      <span
                        className="relative inline-flex h-4 w-4 rounded-full"
                        style={{ backgroundColor: conf.color }}
                      />
                    </span>
                  ) : (
                    <Circle
                      className="h-3 w-3"
                      fill={
                        status === "past"
                          ? "var(--dot-fill, #d1d5db)"
                          : conf.color
                      }
                      stroke="none"
                    />
                  )}
                </div>

                <div
                  className={`min-w-0 flex-1 rounded-xl border p-3 transition-all group-hover:shadow-md ${
                    status === "past"
                      ? "border-gray-200 bg-gray-50/50 opacity-50 dark:border-gray-800 dark:bg-gray-900/30"
                      : status === "ongoing"
                        ? "border-2 bg-white dark:bg-gray-900"
                        : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
                  }`}
                  style={
                    status === "ongoing"
                      ? { borderColor: conf.color }
                      : undefined
                  }
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-sm font-bold"
                          style={{
                            color: status === "past" ? undefined : conf.color,
                          }}
                        >
                          {conf.name}
                        </span>
                        {status === "ongoing" && (
                          <span
                            className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                            style={{ backgroundColor: conf.color }}
                          >
                            LIVE
                          </span>
                        )}
                        {status === "upcoming" && days <= 90 && (
                          <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                            D-{days}
                          </span>
                        )}
                        {status === "past" && (
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            Ended
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        {conf.fullName}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 dark:text-gray-500">
                        <span>
                          {isSingleDay
                            ? formatShortDate(start)
                            : `${formatShortDate(start)} - ${formatShortDate(end)}`}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {conf.location}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="mt-1 h-3.5 w-3.5 flex-shrink-0 text-gray-300 transition-colors group-hover:text-gray-500 dark:text-gray-600 dark:group-hover:text-gray-400" />
                  </div>
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const [tab, setTab] = useState<"international" | "domestic">(
    "international"
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 pt-4 lg:pb-4">
      <h1 className="mb-1 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        GI Conference Calendar
      </h1>
      <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
        Verified from official websites
      </p>

      {/* Mobile tabs */}
      <div className="mb-5 flex gap-2 lg:hidden">
        <button
          onClick={() => setTab("international")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
            tab === "international"
              ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-300"
              : "border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400"
          }`}
        >
          <Globe className="h-4 w-4" />
          International
        </button>
        <button
          onClick={() => setTab("domestic")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
            tab === "domestic"
              ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-300"
              : "border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400"
          }`}
        >
          <Flag className="h-4 w-4" />
          Domestic
        </button>
      </div>

      {/* Mobile: single column */}
      <div className="lg:hidden">
        {tab === "international" ? (
          <Timeline conferences={international} />
        ) : (
          <Timeline conferences={domestic} />
        )}
      </div>

      {/* Desktop: two columns */}
      <div className="hidden gap-8 lg:grid lg:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <Globe className="h-4 w-4" />
            International
          </div>
          <Timeline conferences={international} />
        </div>
        <div>
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <Flag className="h-4 w-4" />
            Domestic
          </div>
          <Timeline conferences={domestic} />
        </div>
      </div>
    </div>
  );
}
