"use client";

import { CalendarDays, MapPin, ExternalLink } from "lucide-react";

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
    name: "DDW",
    fullName: "Digestive Disease Week",
    date: "2026-05-16/2026-05-19",
    location: "Washington, D.C., USA",
    url: "https://ddw.org",
    color: "bg-blue-500",
  },
  {
    name: "ESGE Days",
    fullName: "European Society of Gastrointestinal Endoscopy",
    date: "2026-04-23/2026-04-25",
    location: "Berlin, Germany",
    url: "https://esge.com",
    color: "bg-emerald-500",
  },
  {
    name: "ECCO",
    fullName: "European Crohn's and Colitis Organisation Congress",
    date: "2026-02-25/2026-02-28",
    location: "Vienna, Austria",
    url: "https://ecco-ibd.eu",
    color: "bg-purple-500",
  },
  {
    name: "APDW",
    fullName: "Asian Pacific Digestive Week",
    date: "2026-11-12/2026-11-15",
    location: "Kuala Lumpur, Malaysia",
    url: "https://apdw2026.org",
    color: "bg-rose-500",
  },
  {
    name: "ACG",
    fullName: "American College of Gastroenterology Annual Meeting",
    date: "2026-10-23/2026-10-28",
    location: "Las Vegas, NV, USA",
    url: "https://gi.org",
    color: "bg-amber-500",
  },
  {
    name: "UEGW",
    fullName: "United European Gastroenterology Week",
    date: "2026-10-03/2026-10-06",
    location: "Vienna, Austria",
    url: "https://ueg.eu",
    color: "bg-indigo-500",
  },
  {
    name: "AASLD",
    fullName: "The Liver Meeting",
    date: "2026-11-13/2026-11-17",
    location: "Boston, MA, USA",
    url: "https://aasld.org",
    color: "bg-teal-500",
  },
  {
    name: "JDDW",
    fullName: "Japan Digestive Disease Week",
    date: "2026-10-29/2026-11-01",
    location: "Kobe, Japan",
    url: "https://jddw.jp",
    color: "bg-red-500",
  },
  {
    name: "KSG",
    fullName: "대한소화기학회 추계학술대회",
    date: "2026-11-06/2026-11-08",
    location: "Seoul, Korea",
    url: "https://www.gastrokorea.org",
    color: "bg-sky-500",
  },
  {
    name: "KSGE",
    fullName: "대한소화기내시경학회 세미나",
    date: "2026-06-12/2026-06-14",
    location: "Seoul, Korea",
    url: "https://www.gie.or.kr",
    color: "bg-orange-500",
  },
];

function parseDate(dateStr: string) {
  const [start, end] = dateStr.split("/");
  return {
    start: new Date(start + "T00:00:00"),
    end: new Date(end + "T00:00:00"),
  };
}

function formatDateRange(dateStr: string) {
  const { start, end } = parseDate(dateStr);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const startFmt = start.toLocaleDateString("en-US", opts);
  const endFmt = end.toLocaleDateString("en-US", { ...opts, year: "numeric" });
  return `${startFmt} - ${endFmt}`;
}

function getStatus(dateStr: string): "past" | "ongoing" | "upcoming" {
  const now = new Date();
  const { start, end } = parseDate(dateStr);
  if (now > end) return "past";
  if (now >= start && now <= end) return "ongoing";
  return "upcoming";
}

function StatusBadge({ status }: { status: "past" | "ongoing" | "upcoming" }) {
  if (status === "ongoing") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-300">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
        Live
      </span>
    );
  }
  if (status === "past") {
    return (
      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
        Ended
      </span>
    );
  }
  return null;
}

function daysUntil(dateStr: string) {
  const { start } = parseDate(dateStr);
  const now = new Date();
  const diff = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

export default function CalendarPage() {
  const sorted = [...conferences].sort((a, b) => {
    const statusOrder = { ongoing: 0, upcoming: 1, past: 2 };
    const sa = statusOrder[getStatus(a.date)];
    const sb = statusOrder[getStatus(b.date)];
    if (sa !== sb) return sa - sb;
    return parseDate(a.date).start.getTime() - parseDate(b.date).start.getTime();
  });

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-24 pt-4 lg:pb-4">
      <h1 className="mb-4 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        GI Conference Calendar
      </h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Major gastroenterology conferences and society meetings worldwide.
      </p>

      <div className="space-y-3">
        {sorted.map((conf) => {
          const status = getStatus(conf.date);
          const days = daysUntil(conf.date);

          return (
            <a
              key={conf.name}
              href={conf.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group block rounded-2xl border p-4 transition-all hover:shadow-md ${
                status === "past"
                  ? "border-gray-200 opacity-60 dark:border-gray-800"
                  : "border-gray-200 dark:border-gray-800"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 h-10 w-10 flex-shrink-0 rounded-xl ${conf.color} flex items-center justify-center`}>
                  <CalendarDays className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">
                      {conf.name}
                    </h3>
                    <StatusBadge status={status} />
                    {status === "upcoming" && days <= 60 && (
                      <span className="text-xs text-blue-600 dark:text-blue-400">
                        D-{days}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {conf.fullName}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDateRange(conf.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {conf.location}
                    </span>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 flex-shrink-0 text-gray-300 transition-colors group-hover:text-gray-500 dark:text-gray-600 dark:group-hover:text-gray-400" />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
