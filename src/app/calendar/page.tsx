"use client";

import { MapPin, ExternalLink, Circle } from "lucide-react";

interface Conference {
  name: string;
  fullName: string;
  date: string;
  location: string;
  url: string;
  color: string;
}

const conferences: Conference[] = [
  {
    name: "ECCO",
    fullName: "European Crohn's and Colitis Organisation Congress",
    date: "2026-02-25/2026-02-28",
    location: "Vienna, Austria",
    url: "https://ecco-ibd.eu",
    color: "#a855f7",
  },
  {
    name: "ESGE Days",
    fullName: "European Society of Gastrointestinal Endoscopy",
    date: "2026-04-23/2026-04-25",
    location: "Berlin, Germany",
    url: "https://esge.com",
    color: "#10b981",
  },
  {
    name: "DDW",
    fullName: "Digestive Disease Week",
    date: "2026-05-16/2026-05-19",
    location: "Washington, D.C., USA",
    url: "https://ddw.org",
    color: "#3b82f6",
  },
  {
    name: "KSGE",
    fullName: "대한소화기내시경학회 세미나",
    date: "2026-06-12/2026-06-14",
    location: "Seoul, Korea",
    url: "https://www.gie.or.kr",
    color: "#f97316",
  },
  {
    name: "UEGW",
    fullName: "United European Gastroenterology Week",
    date: "2026-10-03/2026-10-06",
    location: "Vienna, Austria",
    url: "https://ueg.eu",
    color: "#6366f1",
  },
  {
    name: "ACG",
    fullName: "American College of Gastroenterology Annual Meeting",
    date: "2026-10-23/2026-10-28",
    location: "Las Vegas, NV, USA",
    url: "https://gi.org",
    color: "#f59e0b",
  },
  {
    name: "JDDW",
    fullName: "Japan Digestive Disease Week",
    date: "2026-10-29/2026-11-01",
    location: "Kobe, Japan",
    url: "https://jddw.jp",
    color: "#ef4444",
  },
  {
    name: "KSG",
    fullName: "대한소화기학회 추계학술대회",
    date: "2026-11-06/2026-11-08",
    location: "Seoul, Korea",
    url: "https://www.gastrokorea.org",
    color: "#0ea5e9",
  },
  {
    name: "APDW",
    fullName: "Asian Pacific Digestive Week",
    date: "2026-11-12/2026-11-15",
    location: "Kuala Lumpur, Malaysia",
    url: "https://apdw2026.org",
    color: "#f43f5e",
  },
  {
    name: "AASLD",
    fullName: "The Liver Meeting",
    date: "2026-11-13/2026-11-17",
    location: "Boston, MA, USA",
    url: "https://aasld.org",
    color: "#14b8a6",
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

export default function CalendarPage() {
  const currentYear = new Date().getFullYear();
  const filtered = conferences
    .filter((c) => parseDate(c.date).start.getFullYear() >= currentYear)
    .sort((a, b) => parseDate(a.date).start.getTime() - parseDate(b.date).start.getTime());

  // Group by month
  let lastMonth = "";

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-24 pt-4 lg:pb-4">
      <h1 className="mb-1 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        GI Conference Calendar
      </h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        {currentYear} major gastroenterology conferences
      </p>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />

        <div className="space-y-0">
          {filtered.map((conf) => {
            const status = getStatus(conf.date);
            const days = daysUntil(conf.date);
            const { start, end } = parseDate(conf.date);
            const month = getMonthLabel(conf.date);
            const showMonth = month !== lastMonth;
            lastMonth = month;

            return (
              <div key={conf.name}>
                {/* Month label */}
                {showMonth && (
                  <div className="relative flex items-center pb-3 pt-1">
                    <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                        {start.toLocaleDateString("en-US", { month: "short" }).toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Conference item */}
                <a
                  href={conf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex gap-4 pb-6"
                >
                  {/* Timeline dot */}
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
                        fill={status === "past" ? "var(--dot-fill, #d1d5db)" : conf.color}
                        stroke="none"
                        style={status !== "past" ? {} : undefined}
                      />
                    )}
                  </div>

                  {/* Content card */}
                  <div
                    className={`min-w-0 flex-1 rounded-xl border p-4 transition-all group-hover:shadow-md ${
                      status === "past"
                        ? "border-gray-200 bg-gray-50/50 opacity-50 dark:border-gray-800 dark:bg-gray-900/30"
                        : status === "ongoing"
                        ? "border-2 bg-white dark:bg-gray-900"
                        : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
                    }`}
                    style={
                      status === "ongoing" ? { borderColor: conf.color } : undefined
                    }
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-sm font-bold"
                            style={{ color: status === "past" ? undefined : conf.color }}
                          >
                            {conf.name}
                          </span>
                          {status === "ongoing" && (
                            <span
                              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold text-white"
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
                        <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
                          {conf.fullName}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 dark:text-gray-500">
                          <span>
                            {formatShortDate(start)} - {formatShortDate(end)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {conf.location}
                          </span>
                        </div>
                      </div>
                      <ExternalLink className="mt-1 h-4 w-4 flex-shrink-0 text-gray-300 transition-colors group-hover:text-gray-500 dark:text-gray-600 dark:group-hover:text-gray-400" />
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
