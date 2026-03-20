"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FolderTree, BarChart3, CalendarDays, Bookmark, User, Microscope, TrendingUp } from "lucide-react";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/topics", label: "Topics", icon: FolderTree },
  { href: "/trending", label: "Trending", icon: TrendingUp },
  { href: "/clinical-trials", label: "Clinical Trials", icon: Microscope },
  { href: "/insights", label: "Insights", icon: BarChart3 },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/saved", label: "Saved", icon: Bookmark },
  { href: "/account", label: "Account", icon: User },
] as const;

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed bottom-0 left-0 top-14 z-40 hidden w-[200px] flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 lg:flex">
      <nav className="space-y-1 px-3 pt-4">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
