"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FolderTree, BarChart3, CalendarDays, Bookmark, User } from "lucide-react";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/topics", label: "Topics", icon: FolderTree },
  { href: "/insights", label: "Insights", icon: BarChart3 },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/saved", label: "Saved", icon: Bookmark },
  { href: "/account", label: "Account", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-950/95 lg:hidden">
      <div
        className="mx-auto flex max-w-lg items-center justify-around"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 4px)" }}
      >
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-0.5 pb-1 pt-2 text-[10px] font-medium transition-colors ${
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : ""}`} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
