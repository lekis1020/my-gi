"use client";

import { useMemo } from "react";
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

function getMonthKey(dateStr: string) {
  const { start } = parseDate(dateStr);
  return `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthShort(key: string) {
  const [y, m] = key.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
}

function ConferenceCard({ conf }: { conf: Conference }) {
  const status = getStatus(conf.date);
  const days = daysUntil(conf.date);
  const { start, end } = parseDate(conf.date);
  const isSingleDay = conf.date.split("/")[0] === conf.date.split("/")[1];

  return (
    <a
      href={conf.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div
        className={`rounded-lg border p-2 transition-all group-hover:shadow-md lg:rounded-xl lg:p-3 ${
          status === "past"
            ? "border-gray-200 bg-gray-50/50 opacity-50 dark:border-gray-800 dark:bg-gray-900/30"
            : status === "ongoing"
              ? "border-2 bg-white dark:bg-gray-900"
              : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
        }`}
        style={status === "ongoing" ? { borderColor: conf.color } : undefined}
      >
        <div className="flex items-start justify-between gap-1">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span
                className="text-xs font-bold lg:text-sm"
                style={{
                  color: status === "past" ? undefined : conf.color,
                }}
              >
                {conf.name}
              </span>
              {status === "ongoing" && (
                <span
                  className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold text-white lg:px-2 lg:text-xs"
                  style={{ backgroundColor: conf.color }}
                >
                  LIVE
                </span>
              )}
              {status === "upcoming" && days <= 90 && (
                <span className="text-[10px] font-medium text-gray-400 lg:text-xs dark:text-gray-500">
                  D-{days}
                </span>
              )}
              {status === "past" && (
                <span className="text-[10px] text-gray-400 lg:text-xs dark:text-gray-500">
                  Ended
                </span>
              )}
            </div>
            <p className="mt-0.5 truncate text-[10px] text-gray-500 lg:text-xs dark:text-gray-400">
              {conf.fullName}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-gray-400 lg:mt-1.5 lg:gap-x-3 lg:gap-y-1 lg:text-xs dark:text-gray-500">
              <span>
                {isSingleDay
                  ? formatShortDate(start)
                  : `${formatShortDate(start)} - ${formatShortDate(end)}`}
              </span>
              <span className="flex items-center gap-0.5">
                <MapPin className="h-2.5 w-2.5 lg:h-3 lg:w-3" />
                <span className="truncate">{conf.location}</span>
              </span>
            </div>
          </div>
          <ExternalLink className="mt-0.5 hidden h-3.5 w-3.5 flex-shrink-0 text-gray-300 transition-colors group-hover:text-gray-500 lg:block dark:text-gray-600 dark:group-hover:text-gray-400" />
        </div>
      </div>
    </a>
  );
}

export default function CalendarPage() {
  const months = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const allConfs = [...international, ...domestic].filter(
      (c) => parseDate(c.date).start.getFullYear() >= currentYear
    );
    const monthSet = new Set(allConfs.map((c) => getMonthKey(c.date)));
    return Array.from(monthSet).sort();
  }, []);

  const intlByMonth = useMemo(() => {
    const map: Record<string, Conference[]> = {};
    const currentYear = new Date().getFullYear();
    international
      .filter((c) => parseDate(c.date).start.getFullYear() >= currentYear)
      .sort(
        (a, b) =>
          parseDate(a.date).start.getTime() - parseDate(b.date).start.getTime()
      )
      .forEach((c) => {
        const mk = getMonthKey(c.date);
        (map[mk] ||= []).push(c);
      });
    return map;
  }, []);

  const domesticByMonth = useMemo(() => {
    const map: Record<string, Conference[]> = {};
    const currentYear = new Date().getFullYear();
    domestic
      .filter((c) => parseDate(c.date).start.getFullYear() >= currentYear)
      .sort(
        (a, b) =>
          parseDate(a.date).start.getTime() - parseDate(b.date).start.getTime()
      )
      .forEach((c) => {
        const mk = getMonthKey(c.date);
        (map[mk] ||= []).push(c);
      });
    return map;
  }, []);

  return (
    <div className="mx-auto w-full max-w-5xl px-2 pb-24 pt-4 sm:px-4 lg:pb-4">
      <h1 className="mb-1 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        GI Conference Calendar
      </h1>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Verified from official websites
      </p>

      {/* Column headers */}
      <div className="mb-3 grid grid-cols-[1fr_36px_1fr] gap-1.5 sm:gap-2 lg:mb-4 lg:grid-cols-[1fr_48px_1fr] lg:gap-4">
        <div className="flex items-center gap-1 text-xs font-semibold text-gray-700 sm:gap-2 sm:text-sm dark:text-gray-300">
          <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          International
        </div>
        <div />
        <div className="flex items-center gap-1 text-xs font-semibold text-gray-700 sm:gap-2 sm:text-sm dark:text-gray-300">
          <Flag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Domestic
        </div>
      </div>

      {/* Synchronized dual timeline */}
      <div className="relative">
        {/* Center timeline line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gray-200 dark:bg-gray-700" />

        {months.map((mk) => {
          const leftConfs = intlByMonth[mk] || [];
          const rightConfs = domesticByMonth[mk] || [];

          return (
            <div key={mk}>
              {/* Month label - centered */}
              <div className="relative grid grid-cols-[1fr_36px_1fr] gap-1.5 pb-2 pt-1 sm:gap-2 lg:grid-cols-[1fr_48px_1fr] lg:gap-4 lg:pb-3">
                <div />
                <div className="flex items-center justify-center">
                  <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 lg:h-10 lg:w-10 dark:bg-gray-800">
                    <span className="text-[10px] font-bold text-gray-500 lg:text-xs dark:text-gray-400">
                      {getMonthShort(mk)}
                    </span>
                  </div>
                </div>
                <div />
              </div>

              {/* Conference cards row */}
              <div className="relative grid grid-cols-[1fr_36px_1fr] gap-1.5 pb-1 sm:gap-2 lg:grid-cols-[1fr_48px_1fr] lg:gap-4 lg:pb-2">
                {/* Left: international */}
                <div className="space-y-2 lg:space-y-3">
                  {leftConfs.map((conf) => (
                    <ConferenceCard key={conf.name} conf={conf} />
                  ))}
                </div>

                {/* Center: dots */}
                <div className="flex flex-col items-center">
                  {(leftConfs.length > 0 || rightConfs.length > 0) && (
                    <div className="flex flex-col items-center gap-2 pt-2 lg:gap-3 lg:pt-3">
                      {[...leftConfs, ...rightConfs].map((conf) => {
                        const status = getStatus(conf.date);
                        return status === "ongoing" ? (
                          <span
                            key={conf.name}
                            className="relative flex h-2.5 w-2.5 lg:h-3 lg:w-3"
                          >
                            <span
                              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                              style={{ backgroundColor: conf.color }}
                            />
                            <span
                              className="relative inline-flex h-2.5 w-2.5 rounded-full lg:h-3 lg:w-3"
                              style={{ backgroundColor: conf.color }}
                            />
                          </span>
                        ) : (
                          <Circle
                            key={conf.name}
                            className="h-2 w-2 lg:h-2.5 lg:w-2.5"
                            fill={
                              status === "past"
                                ? "var(--dot-fill, #d1d5db)"
                                : conf.color
                            }
                            stroke="none"
                          />
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right: domestic */}
                <div className="space-y-2 lg:space-y-3">
                  {rightConfs.map((conf) => (
                    <ConferenceCard key={conf.name} conf={conf} />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
