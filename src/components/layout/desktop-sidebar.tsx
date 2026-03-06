"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Home, Bookmark, User, LogIn, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useInsightsDrawer } from "@/components/layout/insights-drawer-context";
import { TopicMonitorPanel } from "@/components/layout/topic-monitor-panel";
import { Suspense } from "react";

function NavLink({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      }`}
    >
      <Icon className="h-5 w-5" />
      {label}
    </Link>
  );
}

/** Wrapper that reads topic state from URL params */
function StandaloneTopicPanel() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeQuery = searchParams.get("q") ?? undefined;

  return (
    <TopicMonitorPanel
      activeQuery={activeQuery}
      onActivate={(topic) => router.push(`/?q=${encodeURIComponent(topic)}`)}
      onClearActive={() => router.push("/")}
    />
  );
}

export function DesktopSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { toggle: toggleInsights } = useInsightsDrawer();

  return (
    <aside className="fixed bottom-0 left-0 top-14 z-40 hidden w-[260px] flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 lg:flex">
      {/* Navigation */}
      <nav className="space-y-1 px-3 pt-4">
        <NavLink href="/" icon={Home} label="Home" active={pathname === "/"} />

        {user && (
          <NavLink
            href="/bookmarks"
            icon={Bookmark}
            label="Saved"
            active={pathname === "/bookmarks"}
          />
        )}

        <button
          onClick={toggleInsights}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <BarChart3 className="h-5 w-5" />
          Insights
        </button>

        {user ? (
          <NavLink
            href="/account"
            icon={User}
            label="Account"
            active={pathname === "/account"}
          />
        ) : (
          <NavLink
            href="/login"
            icon={LogIn}
            label="Log in"
            active={pathname === "/login"}
          />
        )}
      </nav>

      {/* Divider */}
      <div className="mx-3 my-3 border-t border-gray-200 dark:border-gray-800" />

      {/* Topics — scrollable */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <Suspense fallback={null}>
          <StandaloneTopicPanel />
        </Suspense>
      </div>
    </aside>
  );
}
